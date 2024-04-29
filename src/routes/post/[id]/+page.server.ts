import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/auth/index';
import { getPostById } from '$lib/stores/posts.store';
import { getSecondsFromUTC } from '$lib/time';
import { addComment, getCommentsByPostId } from '$lib/stores/comments.store';

const db = new Database('db.sqlite');

export const load: PageServerLoad = ({ params }) => {
	const pid = +params.id;
	const post = getPostById(+params.id);
	if (!post) redirect(302, '/');

	const comments = getCommentsByPostId(pid);
	return {
		post: {
			...post,
			createdAt: post.createdAt ? getSecondsFromUTC(post.createdAt) : ''
		},
		comments: comments.map((c) => ({ ...c, createdAt: getSecondsFromUTC(c.createdAt) }))
	};
};

export const actions: Actions = {
	like: (e) => {
		const { user } = getSession(e);
		console.log(user);
		if (!user) return redirect(302, '/signin');

		const { params } = e;
		const pid = params.id;

		const liked = db
			.query('SELECT * FROM posts_likes WHERE post_id = ? AND user_id = ?')
			.get(pid, user.id);

		if (liked) {
			db.prepare('DELETE FROM posts_likes WHERE post_id = ? AND user_id = ?').run(pid, user.id);
		} else {
			db.prepare('INSERT INTO posts_likes (post_id, user_id) VALUES (?, ?)').run(pid, user.id);
		}

		const { request } = e;
		return redirect(302, request.headers.get('referer') ?? '/');
	},
	comment: async (e) => {
		const { user } = getSession(e);
		if (!user) return redirect(302, '/signin');

		const { params } = e;
		const pid = +params.id;
		const post = getPostById(+pid);
		if (!post) return redirect(302, '/');

		const { request } = e;
		const formData = await request.formData();
		const content = formData.get('content')?.toString();
		if (!content) redirect(302, `/post/${pid}`);

		addComment({
			post_id: pid,
			user_id: user.id,
			content,
			createdAt: Date.now()
		});
		redirect(302, `/post/${pid}`);
	}
};
