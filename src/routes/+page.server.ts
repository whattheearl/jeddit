import type { PageServerLoad } from './$types';
import { getSecondsFromUTC } from '$lib/time';
import { getSession } from '$lib/db/sessions';
import { getAllPosts, getPostLikes, isPostLikedByUser } from '$lib/db/posts';
import { sanitizeHtml } from '$lib/domsanitizer';

export const load: PageServerLoad = (e) => {
    const { user } = getSession(e);
    const posts = getAllPosts()
        .reverse()
        .map((p) => ({
            ...p,
            created_at: getSecondsFromUTC(p.created_at),
            likes: getPostLikes(p.id),
            liked: user ? isPostLikedByUser(p.id, user.id) : false,
            content: sanitizeHtml(p.content)
        }));

    return {
        user,
        posts
    };
};
