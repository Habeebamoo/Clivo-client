-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id),
  UNIQUE(email)
);

CREATE TABLE profiles (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  bio TEXT,
  picture TEXT,
  profile_link TEXT,
  following INTEGER,
  followers INTEGER,

  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE profiles;
DROP TABLE users;
-- +goose StatementEnd
