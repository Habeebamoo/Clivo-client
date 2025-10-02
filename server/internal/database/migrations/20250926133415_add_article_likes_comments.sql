-- +goose Up
-- +goose StatementBegin
CREATE TABLE articles (
  article_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  picture TEXT,
  read_time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (article_id),
  FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE tags (
  article_id TEXT NOT NULL,
  tag TEXT NOT NULL,

  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

CREATE TABLE likes (
  article_id TEXT NOT NULL,
  liker_user_id TEXT NOT NULL,

  UNIQUE (article_id, liker_user_id),
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
  FOREIGN KEY (liker_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
  article_id TEXT NOT NULL,
  commenter_user_id TEXT NOT NULL,
  content TEXT NOT NULL,

  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
  FOREIGN KEY (commenter_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE likes;
DROP TABLE comments;
DROP TABLE tags;
DROP TABLE articles;
-- +goose StatementEnd


