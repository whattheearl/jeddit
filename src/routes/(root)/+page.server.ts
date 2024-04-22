import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';

export const load: PageServerLoad = ({ }) => {
  const db = new Database('db.sqlite');
  const posts = db.query('SELECT * FROM posts').all() as { id: number, author: number, title: string, content: string, createdAt: Date }[];
  console.log({ posts })
  return { posts };
};
