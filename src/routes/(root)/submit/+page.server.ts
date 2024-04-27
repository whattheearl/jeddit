import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/session';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const db = new Database('db.sqlite');
		const user = getSession(cookies);
		if (!user) redirect(302, '/login');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!title) return { title, content };

		const community_id = 1; //jeddit hardcoded`

		const now = Date.now();
		db.prepare(
			`INSERT INTO posts (user_id, title, community_id, content, createdAt) 
      VALUES ($user_id, $title, $community_id, $content, $createdAt)`
		).values({
			$user_id: user.id,
			$community_id: community_id,
			$title: title,
			$content: content,
			$createdAt: now
		});

		redirect(302, '/');
	}
};
