import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import { Logger } from '$lib/logger'; 

function getSeconds(milliseconds: number) {
  const now = Date.now();
  const seconds = Math.floor((now - milliseconds) / 1000);
  if (seconds < 60)
    return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 365)
    return `${days} days ago`;

  const years = Math.floor(days / 365);
  return `${years} years ago`
}

export const load: PageServerLoad = () => {
  const logger = Logger('(root).PageServerLoad')

  const db = new Database('db.sqlite');
  const posts = db.query(`
    SELECT posts.id, title, content, users.name as author, communities.name as community, createdAt
    FROM posts
    LEFT JOIN users on users.id = posts.user_id
    LEFT JOIN communities on communities.id = posts.community_id`
  ).all() as { id: number, author: string, community: string, title: string, content: string, createdAt: number }[];

  logger.debug('posts', posts);

  return { posts: posts.reverse().map((p) => ({ ...p, createdAt: getSeconds(p.createdAt) })) ?? [] };
};
