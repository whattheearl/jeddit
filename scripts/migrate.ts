#! ~/.bun/bin/bun
import { Database } from 'bun:sqlite';

const db = new Database('./db.sqlite');

console.log('DROPPING TABLES');
db.exec(`DROP TABLE IF EXISTS users`);
db.exec(`DROP TABLE IF EXISTS sessions`);
db.exec(`DROP TABLE IF EXISTS communities`);
db.exec(`DROP TABLE IF EXISTS posts`);

console.log('CREATING TABLES');
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(38),
  name_finalized BOOLEAN,
  sub TEXT,
  iss TEXT,
  picture TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN
)`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id INTEGER,
  code_verifier VARCHAR(32)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(21)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  community_id INTEGER,
  title TEXT,
  content TEXT,
  createdAt INTEGER
)`);

db.exec('INSERT INTO users (id,name) VALUES (1,"firstuser")')

db.exec(`INSERT INTO communities (id,name) VALUES (1,"jeddit")`)

db.exec(`INSERT INTO posts (user_id, community_id, title, content, createdAt)
  VALUES (1, 1, "Hello world!!", "Just some palce holder text. Don't worry about it...", 0)`)
