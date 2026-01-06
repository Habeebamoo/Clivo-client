-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS articles (
  article_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  picture TEXT,
  read_time TEXT,
  slug TEXT,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (article_id),
  FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT,
  tag TEXT,

  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
  article_id TEXT NOT NULL,
  liker_user_id TEXT NOT NULL,

  UNIQUE (article_id, liker_user_id),
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
  FOREIGN KEY (liker_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  comment_id TEXT NOT NULL,
  article_id TEXT,
  user_id TEXT NOT NULL,
  reply_id TEXT,
  replys INTEGER,
  content TEXT NOT NULL,

  UNIQUE (comment_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE likes;
DROP TABLE comments;
DROP TABLE article_tags;
DROP TABLE articles;
-- +goose StatementEnd


