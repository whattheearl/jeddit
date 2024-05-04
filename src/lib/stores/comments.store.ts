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

interface ICommentLike { user_id: number, comment_id: number; like_value: number }

export const addComment = (comment: IAddComment) =>
  db.run('INSERT INTO posts_comments (post_id, user_id, content, created_at) VALUES (?,?,?,?)', [
    comment.post_id,
    comment.user_id,
    comment.content,
    Date.now()
  ]);

export const getCommentById = (comment_id: number) => db.prepare('SELECT * FROM posts_comments WHERE id = ?').run(comment_id);

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

export const updateCommentsLikeCount = (comment_id: number, like_count: number) =>
  db.prepare('UPDATE posts_comment SET like_count = ? WHERE id = ?').run(like_count, comment_id)

export const getCommentsLikesByUserId = (user_id: number) => db
  .query(`SELECT * FROM users_comments_likes WHERE user_id = ?`)
  .all(user_id) as ICommentLike[];

export const getCommentsLikesByCommentId = (comment_id: number) => db
  .prepare('SELECT * FROM users_comments_likes WHERE comment_id = ?')
  .all(comment_id) as ICommentLike[];

export const addCommentsLikes = (comment_id: number, user_id: number, like_value: number) => db
  .prepare('INSERT INTO users_comments_likes (comment_id,user_id,like_value) VALUES (?,?,?)')
  .run(comment_id, user_id, like_value);

export const updateCommentslikes = (comment_id: number, user_id: number, like_value: number, like_count_difference: number) => db.transaction(() => {
  db.prepare('UPDATE users_comments_likes SET like_value = ? WHERE comment_id = ? AND user_id = ?')
    .run(like_value, comment_id, user_id);
  db.prepare('UPDATE posts_comments SET like_count = like_count + ? WHERE id = ?')
    .run(like_count_difference, comment_id)
})();

