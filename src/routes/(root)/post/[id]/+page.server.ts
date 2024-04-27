import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');
export const actions: Actions = {
	default: ({ cookies, params, request }) => {
		const sid = cookies.get('sid') as string;
		const sess = db.query('SELECT * FROM sessions WHERE id = ?').get(sid) as any;
		if (!sess) return redirect(302, '/login');

		const user = db.query('SELECT * FROM users WHERE id = ?').get(sess.user_id) as any;
		if (!user) return redirect(302, '/login');

		const pid = params.id;

		const liked = db
			.query('SELECT * FROM posts_likes WHERE post_id = ? AND user_id = ?')
			.get(pid, user.id);

		if (liked) {
			db.prepare('DELETE FROM posts_likes WHERE post_id = ? AND user_id = ?').run(pid, user.id);
		} else {
			db.prepare('INSERT INTO posts_likes (post_id, user_id) VALUES (?, ?)').run(pid, user.id);
		}

		return redirect(302, request.headers.get('referer') ?? '/');
	}
};
