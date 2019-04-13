use hubcaps::gists;
use iron::{status, IronResult, Request, Response};
use router::Router;
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
use std::convert::TryFrom;
use std::io::Read;
use tokio::runtime::Runtime;

use crate::errors::Error;
use crate::json;
use crate::middleware::GistsMiddleware;

#[derive(Debug, Serialize, Deserialize)]
struct Playground {
    id: Option<String>,
    messages: String,
    variables: serde_json::Value,
    setup: serde_json::Value,
}

pub fn get(req: &mut Request) -> IronResult<Response> {
    let gists_middleware = req.extensions.get::<GistsMiddleware>().unwrap();
    let gists = &gists_middleware.gists;
    let params = req.extensions.get::<Router>().unwrap();
    let id = params.find("id").expect("No route parameter called id");
    let mut rt = match Runtime::new() {
        Ok(rt) => rt,
        Err(_) => return json::error(status::ServiceUnavailable, Error::Runtime),
    };
    let gist = match rt.block_on(gists.get(id)) {
        Ok(gist) => gist,
        Err(_) => return json::error(status::InternalServerError, Error::GistFetch),
    };
    match Playground::try_from(gist) {
        Ok(playground) => json::respond(playground),
        Err(err) => json::error(status::InternalServerError, err),
    }
}

pub fn create(req: &mut Request) -> IronResult<Response> {
    let gists_middleware = req.extensions.get::<GistsMiddleware>().unwrap();
    let gists = &gists_middleware.gists;
    let mut payload = String::new();
    if let Err(_) = req.body.read_to_string(&mut payload) {
        return json::error(status::InternalServerError, Error::UnreadableRequestBody);
    }
    let playground = match serde_json::from_str::<Playground>(&payload) {
        Ok(playground) => playground,
        Err(_) => return json::error(status::InternalServerError, Error::Deserialization),
    };
    let options = match gists::GistOptions::try_from(playground) {
        Ok(options) => options,
        Err(err) => return json::error(status::InternalServerError, err),
    };
    let mut rt = match Runtime::new() {
        Ok(rt) => rt,
        Err(_) => return json::error(status::ServiceUnavailable, Error::Runtime),
    };
    let gist = match rt.block_on(gists.create(&options)) {
        Ok(gist) => gist,
        Err(_) => return json::error(status::InternalServerError, Error::GistCreate),
    };
    match Playground::try_from(gist) {
        Ok(playground) => json::respond(playground),
        Err(err) => json::error(status::InternalServerError, err),
    }
}

fn try_file_content<'gist>(gist: &'gist gists::Gist, name: &str) -> Result<&'gist String, Error> {
    gist.files
        .get(name)
        .ok_or(Error::MissingFile(name.to_string()))?
        .content
        .as_ref()
        .ok_or(Error::EmptyFile(name.to_string()))
}

fn try_deserialize_json<'gist>(
    gist: &'gist gists::Gist,
    name: &str,
) -> Result<serde_json::value::Value, Error> {
    serde_json::from_str(try_file_content(&gist, name)?).or(Err(Error::Deserialization))
}

impl TryFrom<gists::Gist> for Playground {
    type Error = Error;
    fn try_from(gist: gists::Gist) -> Result<Self, Self::Error> {
        Ok(Playground {
            id: Some(gist.id.clone()),
            messages: try_file_content(&gist, "playground.ftl")?.clone(),
            variables: try_deserialize_json(&gist, "playground.json")?,
            setup: try_deserialize_json(&gist, "setup.json")?,
        })
    }
}

fn try_serialize_json<'gist>(value: &'gist serde_json::value::Value) -> Result<String, Error> {
    serde_json::ser::to_string(value).or(Err(Error::Serialization))
}

impl TryFrom<Playground> for gists::GistOptions {
    type Error = Error;
    fn try_from(playground: Playground) -> Result<Self, Self::Error> {
        let mut files = HashMap::new();
        files.insert(
            "playground.ftl".to_string(),
            gists::Content {
                filename: None,
                content: playground.messages,
            },
        );
        files.insert(
            "playground.json".to_string(),
            gists::Content {
                filename: None,
                content: try_serialize_json(&playground.variables)?,
            },
        );
        files.insert(
            "setup.json".to_string(),
            gists::Content {
                filename: None,
                content: try_serialize_json(&playground.setup)?,
            },
        );
        Ok(gists::GistOptions {
            description: Some("A Fluent Playground snippet".to_string()),
            public: Some(true),
            files,
        })
    }
}
