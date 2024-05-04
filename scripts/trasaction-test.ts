import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

const tx = db.transaction(() =>{
  db.prepare('INSERT INTO users_comments_likes (comment_id,user_id) VALUES (1,2)').run()
})

tx()

console.log(db.query('SELECT * FROM users_comments_likes').all());
