import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/auth/index';
import { getPostById, isPostLikedByUser, likePost, unlikePost } from '$lib/stores/posts.store';
import { getSecondsFromUTC } from '$lib/time';
import {
  addComment,
  getCommentsByPostId,
  getCommentsLikesByUserId,
  isCommentDislikedByUser,
  isCommentLikedByUser
} from '$lib/stores/comments.store';

const db = new Database('db.sqlite');

export const load: PageServerLoad = (e) => {
  const { params } = e;
  const post_id = +params.post_id;
  const post = getPostById(post_id);
  if (!post) redirect(302, '/');

  const { user } = getSession(e);
  const comments = getCommentsByPostId(post_id);
  console.log(comments);
  const commentLikes = user ? getCommentsLikesByUserId(user.id) : [];
  return {
    post: {
      ...post,
      created_at: post.created_at ? getSecondsFromUTC(post.created_at) : ''
    },
    comments: comments.map((c) => ({
      ...c,
      created_at: getSecondsFromUTC(c.created_at),
      isLiked: user ? isCommentLikedByUser(c.id, user.id) : false,
      isDisliked: user ? isCommentDislikedByUser(c.id, user.id) : false,
    }))
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
  }
};
