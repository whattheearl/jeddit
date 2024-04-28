import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

interface IPost {
  id: number;
  author: string;
  community: string;
  title: string;
  content: string;
  createdAt: number;
  likes: number;
  liked: boolean;
}

export const getAllPosts = () => {
  const posts = db.query(`
    SELECT posts.id, title, content, profiles.username as author, communities.name as community, createdAt
    FROM posts
    JOIN users on users.id = posts.user_id
    JOIN profiles on profiles.id = users.profile_id
    JOIN communities on communities.id = posts.community_id
  `).all() as IPost[];
  return posts;
}
