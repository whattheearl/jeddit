import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getSession } from '$lib/db/sessions';
import { getPostById, isPostLikedByUser, likePost, unlikePost, updatePost } from '$lib/db/posts';
import { getSecondsFromUTC } from '$lib/time';
import { addComment, getCommentsByPostId, getCommentsLikesByCommentId } from '$lib/db/comments';
import { sanitizeHtml } from '$lib/domsanitizer';

export const load: PageServerLoad = (e) => {
    const { params } = e;
    const post_id = +params.post_id;
    const post = getPostById(post_id);
    if (!post) {
        redirect(302, '/');
    }

    const { user } = getSession(e);
    const comments = getCommentsByPostId(post_id);

    return {
        user,
        post: {
            ...post,
            content: sanitizeHtml(post.content),
            created_at: post.created_at ? getSecondsFromUTC(post.created_at) : ''
        },
        comments: comments.map((c) => {
            const likes = user
                ? getCommentsLikesByCommentId(c.id).filter((c) => c.user_id == user.id)
                : [];
            return {
                ...c,
                created_at: getSecondsFromUTC(c.created_at),
                isLiked: likes.length > 0 ? likes[0].like_value == 1 : false,
                isDisliked: likes.length > 0 ? likes[0].like_value == -1 : false
            };
        })
    };
};

export const actions: Actions = {
    like: (e) => {
        const { user } = getSession(e);
        if (!user) return redirect(302, '/signin');

        const { params } = e;
        const post_id = +params.post_id;

        if (isPostLikedByUser(post_id, user.id)) {
            unlikePost(post_id, user.id);
        } else {
            likePost(post_id, user.id);
        }

        const { request } = e;
        return redirect(302, request.headers.get('referer') ?? '/');
    },

    comment: async (e) => {
        const { user } = getSession(e);
        if (!user) return redirect(302, '/signin');

        const { params } = e;
        const post_id = +params.post_id;
        const post = getPostById(+post_id);
        if (!post) return redirect(302, '/');

        const { request } = e;
        const formData = await request.formData();
        const content = formData.get('content')?.toString();
        if (!content) redirect(302, `/post/${post_id}`);

        addComment({
            post_id: post_id,
            user_id: user.id,
            content,
            created_at: Date.now()
        });

        redirect(302, `/post/${post_id}`);
    },

    edit: async (e) => {
        const { user } = getSession(e);
        if (!user) return redirect(302, '/signin');

        const { params } = e;
        const post_id = +params.post_id;
        const post = getPostById(+post_id);
        if (!post) return redirect(302, '/');

        if (post.username != user.username) return error(403, 'Unauthorized');

        const { request } = e;
        const formData = await request.formData();
        const content = formData.get('content') as string;
        post.content = sanitizeHtml(content.trim());
        updatePost(post);
        return {};
    }
};
