import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

interface IPost {
	id: number;
	username: string;
	community: string;
	title: string;
	content: string;
	createdAt: number;
	likes: number;
	liked: boolean;
}

export const getAllPosts = () => {
	const posts = db
		.query(
			`
    SELECT posts.id, title, content, user.username, communities.name as community, createdAt
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN communities on communities.id = posts.community_id
  `
		)
		.all() as IPost[];
	return posts;
};

export const getPostById = (id: number) => {
	const post = db
		.query(
			`
    SELECT posts.id, title, content, users.username, communities.name as community, createdAt
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN communities on communities.id = posts.community_id
    WHERE posts.id = ?
  `
		)
		.get(id);
	return post as IPost;
};
