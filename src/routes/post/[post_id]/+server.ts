import { getPostById, updatePost } from '$lib/stores/posts.store.js';
import { getSession } from '$lib/stores/sessions.store.js';

/** @type {import('./$types.js').RequestHandler} */
export const POST = async (event) => {
  const { user } = getSession(event);
  if (!user)
    return new Response(null, { status: 401, statusText: 'unauthenticated' });
  const data = await event.request.json();
  if (!data)
    return new Response(null, { status: 400, statusText: 'bad request' });
  const post = getPostById(data.id);
  if (!post)
    return new Response(null, { status: 404, statusText: 'not found' });
  if (post.username != user?.username)
    return new Response(null, { status: 403, statusText: 'unauthorized' })
  post.content = data.content;
  updatePost(post);
  return new Response(null, { status: 204, statusText: 'success' });
}
