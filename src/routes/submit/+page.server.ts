import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/auth/index';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const actions: Actions = {
	default: async (e) => {
		const db = new Database('db.sqlite');
		const { user } = getSession(e);
		if (!user) redirect(302, '/signin');

		const { request } = e;
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		if (!title || !content) return { title, content };

		const community_id = 1; //jeddit hardcoded`

		const window = new JSDOM('').window;
		const purify = DOMPurify(window);
		const clean = purify.sanitize(content, { ALLOWED_TAGS: [] });

		const now = Date.now();
		db.prepare(
			`INSERT INTO posts (user_id, title, community_id, content, created_at) 
      VALUES ($user_id, $title, $community_id, $content, $created_at)`
		).values({
			$user_id: user.id,
			$community_id: community_id,
			$title: title,
			$content: clean,
			$created_at: now
		});

		redirect(302, '/');
	}
};
