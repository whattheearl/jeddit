import type { PageServerLoad } from './$types';
import { getSecondsFromUTC } from '$lib/time';
import { getSession } from '$lib/auth';
import { getAllPosts, getPostLikes, isPostLikedByUser } from '$lib/db/posts';

export const load: PageServerLoad = (e) => {
    const { user } = getSession(e);
    const posts = getAllPosts();

    return {
        posts:
            posts.reverse().map((p) => ({
                ...p,
                created_at: getSecondsFromUTC(p.created_at),
                likes: getPostLikes(p.id),
                liked: user ? isPostLikedByUser(p.id, user.id) : false
            })) ?? []
    };
};
