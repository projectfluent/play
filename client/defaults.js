export const messages =
`# Try editing the translations here!

hello-world = Hello, world!

shared-photos =
    { $user_name } { $photo_count ->
        [0] hasn't added any photos yet
        [one] added a new photo
       *[other] added { $photo_count } new photos
    }.

liked-comment =
    { $user_name } liked your comment on { $user_gender ->
        [male] his
        [female] her
       *[other] their
    } post.`;

export const variables = {
  user_name: 'Anne',
  user_gender: 'female',
  photo_count: 3
};
