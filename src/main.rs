use corsware::{AllowedOrigins, CorsMiddleware, Origin, UniCase};
use hubcaps::{Credentials, Github};
use iron::{method::Method, status, Chain, Iron, Request, Response};
use router::Router;
use std::collections::HashSet;
use std::env;
use tokio::runtime::Runtime;

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
    router.get(
        "/",
        |_req: &mut Request| {
            let resp = Response::with((status::Ok, "Hello, world!"));
            Ok(resp)
        },
        "index",
    );
    router.get(
        "/gists/:id",
        move |req: &mut Request| {
            let params = req.extensions.get::<Router>().unwrap();
            let id = params.find("id").unwrap();

            let gist = Runtime::new()
                .expect("Unable to create runtime")
                .block_on(gists.get(id))
                .expect("Unable to fetch gist");
            println!("{:#?}", gist);

            let resp = Response::with((status::Ok, format!("Gist id: {}", gist.id)));
            Ok(resp)
        },
        "fetch",
    );

    let mut origins = HashSet::new();
    origins.insert(Origin::parse("https://projectfluent.org").unwrap());

    let mut chain = Chain::new(router);
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
