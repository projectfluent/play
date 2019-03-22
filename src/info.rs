use iron::{IronResult, Request, Response};
use serde::{Serialize};

use crate::json;

#[derive(Debug, Serialize)]
struct Info {
    name: String,
    version: String,
}

pub fn get(_req: &mut Request) -> IronResult<Response> {
    json::respond(Info {
        name: env!("CARGO_PKG_NAME").to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}
