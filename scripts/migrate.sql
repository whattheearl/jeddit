DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_posts_likes;
DROP TABLE IF EXISTS users_comments_likes;
DROP TABLE IF EXISTS users_comments_dislikes;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS communities;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS posts_comments;
DROP TABLE IF EXISTS images;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sub TEXT,
  iss TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN,
  username VARCHAR(38),
  username_finalized BOOLEAN DEFAULT 0,
  picture TEXT
);

CREATE TABLE IF NOT EXISTS users_comments_likes (
  comment_id INTEGER,
  user_id INTEGER,
  like_value INTEGER DEFAULT 0,
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS users_posts_likes (
  post_id INTEGER,
  user_id INTEGER,
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id INTEGER,
  code_verifier VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(21)
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  community_id INTEGER,
  title TEXT,
  content TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS posts_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  user_id INTEGER,
  content TEXT,
  created_at INTEGER,
  like_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS images (
  id VARCHAR(32) PRIMARY KEY,
  image BLOB,
  version INTERGER,
  file_type TEXT
);

INSERT INTO users (id, username) VALUES (1,'firstuser');

INSERT INTO communities (id, name) VALUES (1,'jeddit');

INSERT INTO posts (id, user_id, community_id, title, content, created_at) VALUES (1,1,1,'Hello world!!!!','Just some place holder text. Don''t worry about it...',0);

INSERT INTO users_posts_likes (post_id, user_id) VALUES (1, 1);

INSERT INTO posts_comments (post_id, user_id, content, created_at, like_count) VALUES (1,1,'Wow this is such a good comment',100000, 3);

INSERT INTO users_comments_likes (comment_id,user_id,like_value) VALUES (1,1,1);
INSERT INTO users_comments_likes (comment_id,user_id,like_value) VALUES (1,2,1);
INSERT INTO users_comments_likes (comment_id,user_id,like_value) VALUES (1,3,1);

