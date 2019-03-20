use iron::{status, Iron, IronResult, Request, Response};
use router::Router;
use std::env;

fn index(_: &mut Request) -> IronResult<Response> {
    let resp = Response::with((status::Ok, "Hello, world!"));
    Ok(resp)
}

fn gist_get(req: &mut Request) -> IronResult<Response> {
    let params = req.extensions.get::<Router>().unwrap();
    let name = params.find("id").unwrap();
    let resp = Response::with((status::Ok, format!("Hello, {}!", name)));
    Ok(resp)
}

fn main() {
    let port = env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse()
        .expect("Unable to parse PORT into a number");

    let mut router: Router = Router::new();
    router.get("/", index, "index");
    router.get("/gist/:id", gist_get, "name");

    Iron::new(router).http(("0.0.0.0", port)).unwrap();
}
