import type { Cookies } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';

const cookieName = 'sid';
const db = new Database('db.sqlite');

export interface ISession {
	id: string;
	user_id: number;
	code_verifier: string;
}

export const getSession = (cookies: Cookies) => {
	const sid = cookies.get(cookieName)?.toString();
  if (!sid)
    return null;
	return db.query('SELECT * FROM sessions WHERE id = ?').get(sid) as ISession;
};

export const updateSession = (cookies: Cookies, sess: ISession) => {
	const sid = cookies.get(cookieName) as string;
	db.run('UPDATE sessions SET user_id = ? WHERE id = ?', [sess.user_id, sid]);
};
