import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/auth/index';
import { getPostById } from '$lib/stores/posts.store';
import { getSecondsFromUTC } from '$lib/time';

const db = new Database('db.sqlite');

export const load: PageServerLoad = ({ params }) => {
  const post = getPostById(+params.id);
  return { post: { ...post, createdAt: getSecondsFromUTC(post.createdAt) } };
}

export const actions: Actions = {
  default: (e) => {
    const { user } = getSession(e);
    if (!user) return redirect(302, '/signin');

    const { params } = e;
    const pid = params.id;

    const liked = db
      .query('SELECT * FROM posts_likes WHERE post_id = ? AND user_id = ?')
      .get(pid, user.id);

    if (liked) {
      db.prepare('DELETE FROM posts_likes WHERE post_id = ? AND user_id = ?').run(pid, user.id);
    } else {
      db.prepare('INSERT INTO posts_likes (post_id, user_id) VALUES (?, ?)').run(pid, user.id);
    }

    const { request } = e;
    return redirect(302, request.headers.get('referer') ?? '/');
  }
};
