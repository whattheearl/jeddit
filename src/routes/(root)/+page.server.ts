import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import { Logger } from '$lib/logger';


export const load: PageServerLoad = () => {
  const logger = Logger('(root).PageServerLoad')

  const db = new Database('db.sqlite');
  const posts = db.query(`
    SELECT posts.id, title, content, users.name as author, communities.name as community
    FROM posts
    LEFT JOIN users on users.id = posts.user_id
    LEFT JOIN communities on communities.id = posts.community_id`
  ).all() as { id: number, author: string, community: string, title: string, content: string, createdAt: Date }[];

  logger.debug(posts);
  return { posts: posts ?? [] };
};
