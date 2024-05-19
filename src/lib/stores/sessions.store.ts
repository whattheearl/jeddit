import type { RequestEvent } from '@sveltejs/kit';
import { getUserById, type IUser } from './users.store';
import { dev } from '$app/environment';
import Database from 'better-sqlite3';

const db = new Database('db.sqlite');
const cookieName = 'sid';

export interface ISession {
	user: IUser | null;
}

export interface ICookieSession {
	user_id: number;
}

export const createSession = ({ cookies }: RequestEvent) => {
	const sid = crypto.randomUUID();
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 30);
	cookies.set(cookieName, sid, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		expires: new Date(),
		maxAge: 60 * 60 * 24 * 30
	});
	db.prepare('INSERT INTO sessions (id) VALUES (?)').run(sid);
};

export const updateSession = ({ cookies }: RequestEvent, uid: number) => {
	const sid = cookies.get(cookieName) as string;
	if (!sid) throw new Error('sid is required');
	db.prepare('UPDATE sessions SET user_id = $user_id WHERE id == ?').run(sid, uid);
};

export const getSession = ({ cookies }: RequestEvent) => {
	const sid = cookies.get(cookieName) as string;
	const cookieSession = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sid) as {
		user_id: number;
	};
	if (!cookieSession) return { user: null } as ISession;

	const user = getUserById(cookieSession.user_id);
	if (!user) return { user: null };

	return { user } as ISession;
};

export const deleteSession = ({ cookies }: RequestEvent) => {
	const sid = cookies.get('sid') as string;
	if (!sid) return;

	cookies.delete('sid', { path: '/' });
	const db = new Database('db.sqlite');
	db.prepare('DELETE FROM sessions WHERE id == ?').run(sid);
};
