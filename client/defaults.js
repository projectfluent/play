export const messages = `\
# Try editing the translations below.
# Set $variables' values in the Config tab.

shared-photos =
    {$UserName} {$PhotoCount ->
        [one] added a new photo
       *[other] added {$PhotoCount} new photos
    } to {$UserGender ->
        [male] his stream
        [female] her stream
       *[other] their stream
    }.
`;

export const variables = {
  UserName: 'Anne',
  UserGender: 'female',
  PhotoCount: 3
};
