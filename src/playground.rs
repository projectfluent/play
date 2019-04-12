use hubcaps::gists;
use iron::{IronResult, Request, Response};
use router::Router;
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
use std::convert::TryFrom;
use std::io::Read;
use tokio::runtime::Runtime;

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
    let id = params.find("id").unwrap();
    let gist = Runtime::new()
        .expect("Unable to create runtime")
        .block_on(gists.get(id))
        .expect("Unable to fetch gist");
    match Playground::try_from(gist) {
        Ok(playground) => json::respond(playground),
        Err(err) => json::error(err),
    }
}

pub fn create(req: &mut Request) -> IronResult<Response> {
    let gists_middleware = req.extensions.get::<GistsMiddleware>().unwrap();
    let gists = &gists_middleware.gists;
    let mut payload = String::new();
    req.body
        .read_to_string(&mut payload)
        .expect("Failed to read request body");
    let playground = serde_json::from_str::<Playground>(&payload).unwrap();
    let gist = Runtime::new()
        .expect("Unable to create runtime")
        .block_on(gists.create(&gists::GistOptions::from(playground)))
        .expect("Unable to create gist");
    match Playground::try_from(gist) {
        Ok(playground) => json::respond(playground),
        Err(err) => json::error(err),
    }
}

fn try_file_content<'gist>(gist: &'gist gists::Gist, name: &str) -> Result<&'gist String, String> {
    gist.files
        .get(name)
        .ok_or(format!("File missing from gist: {}", name))?
        .content
        .as_ref()
        .ok_or(format!("Empty file in gist: {}", name))
}

fn try_json_value<'gist>(
    gist: &'gist gists::Gist,
    name: &str,
) -> Result<serde_json::value::Value, String> {
    serde_json::from_str(try_file_content(&gist, name)?)
        .or(Err(format!("Error deserializing {}", name)))
}

impl TryFrom<gists::Gist> for Playground {
    type Error = String;
    fn try_from(gist: gists::Gist) -> Result<Self, Self::Error> {
        Ok(Playground {
            id: Some(gist.id.clone()),
            messages: try_file_content(&gist, "playground.ftl")?.clone(),
            variables: try_json_value(&gist, "playground.json")?,
            setup: try_json_value(&gist, "setup.json")?,
        })
    }
}

impl From<Playground> for gists::GistOptions {
    fn from(playground: Playground) -> Self {
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
                content: serde_json::ser::to_string(&playground.variables).unwrap(),
            },
        );
        files.insert(
            "setup.json".to_string(),
            gists::Content {
                filename: None,
                content: serde_json::ser::to_string(&playground.setup).unwrap(),
            },
        );
        gists::GistOptions {
            description: Some("A Fluent Playground snippet".to_string()),
            public: Some(true),
            files,
        }
    }
}
