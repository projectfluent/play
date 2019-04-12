use std::fmt;

#[derive(Debug)]
pub enum Error {
    Runtime,
    GistFetch,
    GistCreate,
    UnreadableRequestBody,
    Deserialization,
    Serialization,
    MissingFile(String),
    EmptyFile(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Error::Runtime => write!(f, "Error creating runtime"),
            Error::GistFetch => write!(f, "Error fetching playground"),
            Error::GistCreate => write!(f, "Error creating playground"),
            Error::UnreadableRequestBody => write!(f, "Error reading request body"),
            Error::Deserialization => write!(f, "Error deserializing playground"),
            Error::Serialization => write!(f, "Error serializing playground"),
            Error::MissingFile(name) => write!(f, "File missing from playground: {}", name),
            Error::EmptyFile(name) => write!(f, "Empty file in playground: {}", name),
        }
    }
}
