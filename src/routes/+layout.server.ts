import type { LayoutServerLoad } from "./$types";
import { Database } from 'bun:sqlite';

export const load: LayoutServerLoad = ({ cookies }) => {
  const session_id = cookies.get('session_id') as string;
  const db = new Database('./db.sqlite');
  console.log({ session_id })
  const { user_id } = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: session_id }) as any;
  console.log({ user_id })
  const user = db.query('SELECT email, name FROM users WHERE id = $user_id').get({ $user_id: user_id });
  console.log({ user })
}
