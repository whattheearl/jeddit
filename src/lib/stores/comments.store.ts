import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

interface IAddComment {
	post_id: number;
	user_id: number;
	content: string;
	createdAt: number;
}

interface IComment {
	id: number;
	username: string;
	picture: string;
	content: string;
	createdAt: number;
}

export const addComment = (comment: IAddComment) =>
	db.run('INSERT INTO posts_comments (post_id, user_id, content, createdAt) VALUES (?,?,?,?)', [
		comment.post_id,
		comment.user_id,
		comment.content,
		Date.now()
	]);

export const getCommentsByPostId = (postId: number) => {
	const comments =
		db
			.query(
				`
    SELECT users.username, users.picture, content, posts_comments.createdAt
    FROM posts_comments 
    JOIN users on users.id = posts_comments.user_id
    WHERE posts_comments.post_id = ?
  `
			)
			.all(postId) ?? [];
	return comments as IComment[];
};
