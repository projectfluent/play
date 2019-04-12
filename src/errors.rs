use std::fmt;

#[derive(Debug)]
pub enum Error {
    UnreadableRequestBody,
    Deserialization,
    Serialization,
    MissingFile(String),
    EmptyFile(String),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Error::UnreadableRequestBody => write!(f, "Error reading request body"),
            Error::Deserialization => write!(f, "Error deserializing"),
            Error::Serialization => write!(f, "Error serializing"),
            Error::MissingFile(name) => write!(f, "File missing from gist: {}", name),
            Error::EmptyFile(name) => write!(f, "Empty file in gist: {}", name),
        }
    }
}
