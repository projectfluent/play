use std::fmt;

#[derive(Debug)]
pub enum Error {
    Runtime,
    NotFound,
    Fetching,
    Creating,
    ReadingRequest,
    Deserializing,
    Serializing,
    MissingFile(String),
    EmptyFile(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Error::Runtime => write!(f, "Error creating runtime"),
            Error::NotFound => write!(f, "Playground not found"),
            Error::Fetching => write!(f, "Error fetching playground"),
            Error::Creating => write!(f, "Error creating playground"),
            Error::ReadingRequest => write!(f, "Error reading request body"),
            Error::Deserializing => write!(f, "Error deserializing playground"),
            Error::Serializing => write!(f, "Error serializing playground"),
            Error::MissingFile(name) => write!(f, "File missing from playground: {}", name),
            Error::EmptyFile(name) => write!(f, "Empty file in playground: {}", name),
        }
    }
}
