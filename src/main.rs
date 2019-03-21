use hubcaps::{Credentials, Github};
use iron::{status, Iron, Request, Response};
use router::Router;
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
        "/gist/:id",
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

    Iron::new(router).http(("0.0.0.0", port)).unwrap();
}
