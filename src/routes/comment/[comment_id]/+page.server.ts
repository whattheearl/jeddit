import { getSession } from '$lib/auth';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { dislikeComment, isCommentDislikedByUser, isCommentLikedByUser, likeComment } from '$lib/stores/comments.store';
import { isPostLikedByUser } from '$lib/stores/posts.store';

export const actions: Actions = {

  like: async (e) => {
    const { params } = e;
    const { user } = getSession(e);
    if (!user)
      redirect(302, '/signin')

    const comment_id = +params.comment_id;
    if (!comment_id)
      error(400, 'comment_id required');

    if (isCommentLikedByUser(comment_id, user.id))
      return {};

    likeComment(comment_id, user.id);
  },

  dislike: async (e) => {
    const { params } = e;
    const { user } = getSession(e);
    if (!user)
      redirect(302, '/signin')

    const comment_id = +params.comment_id;
    if (!comment_id)
      error(400, 'comment_id required');

    if (isCommentDislikedByUser(comment_id, user.id))
      return {};

    dislikeComment(comment_id, user.id);
  }
};
