import { sanitizeHtml } from '$lib/domsanitizer';
import * as Posts from '$lib/db/posts';
import { getSession } from '$lib/db/sessions';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

// images
export const POST: RequestHandler = async (event) => {
  const file = await event.request.blob();
  const str = await file.text();
  const buf = await file.arrayBuffer();
  const hash = crypto.createHash('md5').update(str).digest('hex');  
  const type = file.type.split('/')[1];
  await fs.writeFile(`./${hash}.${type}`, Buffer.from(buf))
  console.log({file});
  return new Response(null, { status: 204 });
}

// posts
export const PATCH: RequestHandler = async (event) => {
  const { user } = getSession(event);
  if (!user) return new Response(null, { status: 401, statusText: 'unauthenticated' });
  const data = await event.request.json();
  if (!data) return new Response(null, { status: 400, statusText: 'bad request' });
  const post = Posts.getPostById(data.id);
  if (!post) return new Response(null, { status: 404, statusText: 'not found' });
  if (post.username != user?.username)
    return new Response(null, { status: 403, statusText: 'unauthorized' });
  post.content = sanitizeHtml(data.content.trim());
  Posts.updatePost(post);
  return new Response(null, { status: 204, statusText: 'success' });
};
