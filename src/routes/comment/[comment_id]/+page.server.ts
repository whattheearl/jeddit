import { getSession } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import {
	addCommentsLikes,
	getCommentsLikesByCommentId,
	updateCommentslikes
} from '$lib/stores/comments.store';

export const actions: Actions = {
	like: async (e) => {
		const { params } = e;
		const { user } = getSession(e);
		if (!user) redirect(302, '/signin');

		const comment_id = +params.comment_id;
		if (!comment_id) error(400, 'comment_id required');

		let liked = getCommentsLikesByCommentId(comment_id).filter((l) => l.user_id == user.id)[0];
		if (!liked) {
			addCommentsLikes(comment_id, user.id, 0);
		}

		liked = getCommentsLikesByCommentId(comment_id).filter((l) => l.user_id == user.id)[0];
		const new_like_value = liked.like_value == 1 ? 0 : 1;
		const like_count_difference = new_like_value - liked.like_value;
		updateCommentslikes(comment_id, user.id, new_like_value, like_count_difference);
		return {};
	},

	dislike: async (e) => {
		const { params } = e;
		const { user } = getSession(e);
		if (!user) redirect(302, '/signin');

		const comment_id = +params.comment_id;
		if (!comment_id) error(400, 'comment_id required');

		let liked = getCommentsLikesByCommentId(comment_id).filter((l) => l.user_id == user.id)[0];
		if (!liked) {
			addCommentsLikes(comment_id, user.id, 0);
		}

		liked = getCommentsLikesByCommentId(comment_id).filter((l) => l.user_id == user.id)[0];
		const new_like_value = liked.like_value == -1 ? 0 : -1;
		const like_count_difference = new_like_value - liked.like_value;
		updateCommentslikes(comment_id, user.id, new_like_value, like_count_difference);
		return {};
	}
};
