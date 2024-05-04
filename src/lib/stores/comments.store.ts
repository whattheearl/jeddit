import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

interface IAddComment {
  post_id: number;
  user_id: number;
  content: string;
  created_at: number;
}

interface IComment {
  id: number;
  username: string;
  picture: string;
  content: string;
  created_at: number;
  like_count: number;
  isLiked: boolean;
}

export const addComment = (comment: IAddComment) =>
  db.run('INSERT INTO posts_comments (post_id, user_id, content, created_at) VALUES (?,?,?,?)', [
    comment.post_id,
    comment.user_id,
    comment.content,
    Date.now()
  ]);

export const getCommentsByPostId = (post_id: number) => {
  return db.query<IComment, number>(
    `
    SELECT posts_comments.id, users.username, users.picture, posts_comments.content, posts_comments.created_at, posts_comments.like_count
    FROM posts_comments
    JOIN users on users.id = posts_comments.user_id
    WHERE posts_comments.post_id = ?
  `
  )
    .all(post_id) ?? [];
};

export const getCommentsLikesByUserId = (user_id: number) => db
  .query<number[], number>(`SELECT comment_id FROM users_comments_likes WHERE user_id = ?`)
  .all(user_id);

export const isCommentLikedByUser = (comment_id: number, user_id: number) =>
  !!db.query('SELECT comment_id FROM users_comments_likes WHERE comment_id = ? and user_id = ?').get(comment_id, user_id);

export const isCommentDislikedByUser = (comment_id: number, user_id: number) =>
  !!db.query('SELECT comment_id FROM users_comments_dislikes WHERE comment_id = ? and user_id = ?').get(comment_id, user_id);

const likeCommentTransaction = db.transaction((comment_id: number, user_id: number) => {
  db.prepare('DELETE FROM users_comments_dislikes WHERE comment_id = ? AND user_id = ?').run(comment_id, user_id);
  db.prepare('INSERT INTO users_comments_likes (comment_id,user_id) VALUES (?,?)').run(comment_id, user_id);
  db.prepare('UPDATE posts_comments SET like_count = like_count + 1 WHERE id = ?').run(comment_id);
})
export const likeComment = (comment_id: number, user_id: number) => likeCommentTransaction(comment_id, user_id)

const dislikeCommentTransaction = db.transaction((comment_id: number, user_id: number) => {
  db.prepare('DELETE FROM users_comments_likes WHERE comment_id = ? AND user_id = ?').run(comment_id, user_id);
  db.prepare('INSERT INTO users_comments_dislikes (comment_id, user_id) VALUES (?,?)').run(comment_id, user_id);
  db.prepare('UPDATE posts_comments SET like_count = like_count - 1 WHERE id = ?').run(comment_id);
})
export const dislikeComment = (comment_id: number, user_id: number) => dislikeCommentTransaction(comment_id, user_id)
