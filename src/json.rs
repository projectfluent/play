use iron::{headers::ContentType, modifiers::Header, status, IronResult, Response};
use serde::Serialize;
use serde_json;
use std::fmt::Display;

pub fn respond(response: impl Serialize) -> IronResult<Response> {
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

pub fn error(message: impl Display) -> IronResult<Response> {
    Ok(Response::with((
        status::InternalServerError,
        Header(ContentType::json()),
        format!(r#"{{"error": "{}"}}"#, message),
    )))
}
