import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import { getSecondsFromUTC } from '$lib/time';
import { getUserByCookie } from '$lib/user';

export const load: PageServerLoad = ({ cookies }) => {
	const db = new Database('db.sqlite');
	const posts = db
		.query(
			`
    SELECT posts.id, title, content, users.name as author, communities.name as community, createdAt
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN communities on communities.id = posts.community_id
  `
		)
		.all() as {
		id: number;
		author: string;
		community: string;
		title: string;
		content: string;
		createdAt: number;
		likes: number;
		liked: boolean;
	}[];

	const user = getUserByCookie(cookies);

	return {
		posts:
			posts.reverse().map((p) => ({
				...p,
				createdAt: getSecondsFromUTC(p.createdAt),
				likes: (
					db
						.query('SELECT COUNT(post_id) as count FROM posts_likes WHERE post_id = $pid')
						.all({ $pid: p.id })[0] as { count: number }
				).count,
				liked: user
					? db
							.query('SELECT post_id FROM posts_likes WHERE post_id = $pid AND user_id = $uid')
							.all({ $pid: p.id, $uid: user.id }).length != 0
					: false
			})) ?? []
	};
};
