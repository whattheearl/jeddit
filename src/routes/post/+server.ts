import * as Posts from '$lib/db/posts';
import { getSession } from '$lib/db/sessions';

/** @type {import('./$types.js').RequestHandler} */
export const POST = async (event) => {
    const { user } = getSession(event);
    if (!user) {
        return new Response(null, { status: 401, statusText: 'unauthenticated' });
    }

    const data: Posts.IAddPost = await event.request.json();
    if (!data || !data.content) {
        return new Response(null, { status: 400, statusText: 'bad request' });
    }

    Posts.addPost({
        content: data.content,
        created_at: Date.now(),
        user_id: user.id,
        community_id: 1,
        title: ''
    });

    return new Response(null, { status: 204, statusText: 'success' });
};
