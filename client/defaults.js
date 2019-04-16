export const messages = `\
# Try editing the translations below.
# Set $variables' values in the Config tab.

shared-photos =
    {$userName} {$photoCount ->
        [one] added a new photo
       *[other] added {$photoCount} new photos
    } to {$userGender ->
        [male] his stream
        [female] her stream
       *[other] their stream
    }.
`;

export const variables = {
  userName: 'Anne',
  userGender: 'female',
  photoCount: 3
};
