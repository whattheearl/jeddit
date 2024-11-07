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
        if (!user) redirect(302, '/signin');

        const { request } = e;
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        if (!title || !content) return { title, content };

        const community_id = 1; //jeddit hardcoded`

        const sanitizedContent = sanitizeHtml(content.trim());

        addPost({
            user_id: user.id,
            community_id: community_id,
            title: title,
            content: sanitizedContent,
            created_at: Date.now()
        });

        redirect(302, '/');
    }
};
