use iron::prelude::*;
use iron::status;
use std::env;

fn main() {
    let port = env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse()
        .expect("Unable to parse PORT into a number");
    Iron::new(|_: &mut Request| Ok(Response::with((status::Ok, "Hello World!"))))
        .http(("localhost", port))
        .unwrap();
}
