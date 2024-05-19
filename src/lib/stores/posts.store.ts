import Database from 'better-sqlite3';

const db = new Database('db.sqlite');

interface IPost {
	id: number;
	username: string;
	community: string;
	title: string;
	content: string;
	created_at: number;
	likes: number;
	liked: boolean;
}

export const getAllPosts = () => {
	const posts = db
		.prepare(
			`
    SELECT posts.id, posts.title, posts.content, users.username, communities.name as community, posts.created_at
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN communities on communities.id = posts.community_id`
		)
		.all() as IPost[];

	return posts;
};

export const getPostById = (post_id: number) => {
	const post = db
		.prepare(
			`
    SELECT posts.id, title, content, users.username, communities.name as community, created_at
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN communities on communities.id = posts.community_id
    WHERE posts.id = ?`
		)
		.get(post_id);

	return post as IPost;
};

export interface IAddPost {
	user_id: number;
	community_id: number;
	title: string;
	content: string;
	created_at: number;
}

export const addPost = (addPost: IAddPost) => db
		.prepare("INSERT INTO posts (user_id, title, community_id, content, created_at) VALUES (?,?,?,?,?)")
		.run(
			addPost.user_id,
			addPost.title,
			addPost.community_id,
			addPost.content,
			addPost.created_at
		);

export const updatePost = (post: IPost) =>
	db.prepare('UPDATE posts SET content = ? WHERE id = ?').run(post.content, post.id);

export const getPostLikes = (post_id: number) => {
	const likes = db
		.prepare(
			`SELECT COUNT(user_id) AS count FROM users_posts_likes WHERE users_posts_likes.post_id = ?`
		)
		.get(post_id) as { count: number };
	return likes.count;
};

export const isPostLikedByUser = (post_id: number, user_id: number) => {
	const result =
		db
			.prepare(
				'SELECT post_id FROM users_posts_likes WHERE users_posts_likes.post_id = ? AND users_posts_likes.user_id = ?'
			)
			.all(post_id, user_id).length != 0;
	return result;
};

export const likePost = (post_id: number, user_id: number) =>
	db
		.prepare('INSERT INTO users_posts_likes (post_id, user_id) VALUES (?, ?)')
		.run(post_id, user_id);

export const unlikePost = (post_id: number, user_id: number) =>
	db
		.prepare('DELETE FROM users_posts_likes WHERE post_id = ? AND user_id = ?')
		.run(post_id, user_id);
