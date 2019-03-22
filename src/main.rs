use corsware::{AllowedOrigins, CorsMiddleware, Origin, UniCase};
use hubcaps::{gists, Credentials, Github};
use iron::{
    headers::ContentType, method::Method, modifiers::Header, status, Chain, Iron, IronResult,
    Request, Response,
};
use router::Router;
use serde::Serialize;
use serde_json;
use std::collections::{HashMap, HashSet};
use std::env;
use tokio::runtime::Runtime;

mod middleware;
use middleware::GistsMiddleware;

fn main() {
    let port = env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse()
        .expect("Unable to parse PORT into a number");
    let token = env::var("GITHUB_API_TOKEN").expect("Missing GitHub API token");

    let github = Github::new(
        concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION")),
        Credentials::Token(token),
    );
    let gists = github.gists();

    let mut router = Router::new();
    router.get("/", index_get, "index");
    router.get("/gists/:id", playground_get, "fetch");

    let mut origins = HashSet::new();
    origins.insert(Origin::parse("https://projectfluent.org").unwrap());

    let mut chain = Chain::new(router);
    chain.link_before(GistsMiddleware::new(gists));
    chain.link_around(CorsMiddleware {
        allowed_origins: AllowedOrigins::Specific(origins),
        allowed_headers: vec![UniCase("Content-Type".to_owned())],
        allowed_methods: vec![Method::Get, Method::Post],
        exposed_headers: vec![],
        allow_credentials: false,
        max_age_seconds: 60 * 60,
        prefer_wildcard: false,
    });

    Iron::new(chain).http(("0.0.0.0", port)).unwrap();
}

#[derive(Debug, Serialize)]
struct Index {
    name: String,
    version: String,
}

fn index_get(_req: &mut Request) -> IronResult<Response> {
    json_response(Index {
        name: env!("CARGO_PKG_NAME").to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

#[derive(Debug, Serialize)]
struct Playground {
    id: String,
    messages: String,
    variables: serde_json::Value,
    setup: serde_json::Value,
}

fn playground_get(req: &mut Request) -> IronResult<Response> {
    let gists_middleware = req.extensions.get::<GistsMiddleware>().unwrap();
    let gists = &gists_middleware.gists;
    let params = req.extensions.get::<Router>().unwrap();
    let id = params.find("id").unwrap();
    let gist = Runtime::new()
        .expect("Unable to create runtime")
        .block_on(gists.get(id))
        .expect("Unable to fetch gist");
    json_response(Playground::from(gist))
}

fn get_file_content<'gist>(gist: &'gist gists::Gist, name: &str) -> &'gist String {
    gist.files.get(name).unwrap().content.as_ref().unwrap()
}

impl From<gists::Gist> for Playground {
    fn from(gist: gists::Gist) -> Self {
        Playground {
            id: gist.id.clone(),
            messages: get_file_content(&gist, "playground.ftl").clone(),
            variables: serde_json::from_str(&get_file_content(&gist, "playground.json")).unwrap(),
            setup: serde_json::from_str(&get_file_content(&gist, "setup.json")).unwrap(),
        }
    }
}

fn json_response(response: impl Serialize) -> IronResult<Response> {
    match serde_json::ser::to_string(&response) {
        Ok(body) => Ok(Response::with((
            status::Ok,
            Header(ContentType::json()),
            body,
        ))),
        Err(_) => Ok(Response::with((
            status::InternalServerError,
            Header(ContentType::json()),
            r#"{"error": "Error serializing response"}"#,
        ))),
    }
}
