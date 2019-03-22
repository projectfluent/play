use hubcaps::gists;
use iron::{
    IronResult,
    Request, Response,
};
use router::Router;
use serde::{Deserialize, Serialize};
use serde_json;
use std::collections::HashMap;
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
    json::respond(Playground::from(gist))
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
    json::respond(Playground::from(gist))
}

fn get_file_content<'gist>(gist: &'gist gists::Gist, name: &str) -> &'gist String {
    gist.files.get(name).unwrap().content.as_ref().unwrap()
}

impl From<gists::Gist> for Playground {
    fn from(gist: gists::Gist) -> Self {
        Playground {
            id: Some(gist.id.clone()),
            messages: get_file_content(&gist, "playground.ftl").clone(),
            variables: serde_json::from_str(&get_file_content(&gist, "playground.json")).unwrap(),
            setup: serde_json::from_str(&get_file_content(&gist, "setup.json")).unwrap(),
        }
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
