use hubcaps;
use iron;
use std::sync::Arc;

type Gists = hubcaps::gists::Gists<hyper_tls::HttpsConnector<hyper::client::HttpConnector>>;

#[derive(Clone)]
pub struct GistsMiddleware {
    pub gists: Arc<Gists>,
}

impl GistsMiddleware {
    pub fn new(gists: Gists) -> Self {
        GistsMiddleware {
            gists: Arc::new(gists),
        }
    }
}

impl iron::BeforeMiddleware for GistsMiddleware {
    fn before(&self, req: &mut iron::Request<'_, '_>) -> iron::IronResult<()> {
        req.extensions.insert::<Self>(self.clone());
        Ok(())
    }
}

impl iron::typemap::Key for GistsMiddleware {
    type Value = Self;
}
