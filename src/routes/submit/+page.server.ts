import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSession } from '$lib/db/sessions';
import { sanitizeHtml } from '$lib/domsanitizer';
import { addPost } from '$lib/db/posts';

export const load: PageServerLoad = (event) => {
    const { user } = getSession(event);
    return { user };
};

export const actions: Actions = {
    default: async (e) => {
        const { user } = getSession(e);
        if (!user) {
            redirect(302, '/signin');
        }

        const { request } = e;
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        if (!title || !content) {
            return { title, content };
        }

        addPost({
            user_id: user.id,
            community_id: 1,
            title: title,
            content: sanitizeHtml(content.trim()),
            created_at: Date.now()
        });

        redirect(302, '/');
    }
};
