#! ~/.bun/bin/bun
import { Database } from 'bun:sqlite';

const db = new Database('./db.sqlite');

console.log('DROPPING TABLES');
db.exec(`DROP TABLE IF EXISTS users`);
db.exec(`DROP TABLE IF EXISTS sessions`);
db.exec(`DROP TABLE IF EXISTS posts`);

console.log('CREATING TABLES');
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sub TEXT,
  iss TEXT,
  name TEXT,
  given_name TEXT,
  family_name TEXT,
  picture TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN,
  local TEXT,
  username TEXT
)`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id INTEGER,
  code_verifier VARCHAR(32)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER,
  title TEXT,
  content TEXT
)`);

db.exec(`INSERT INTO posts (author_id, title, content)
  VALUES (1, "Hello world!", "Just some palce holder text. Don't worry about it...")
`)
