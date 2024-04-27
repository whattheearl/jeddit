import type { Cookies } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { getSession } from './session';

const db = new Database('db.sqlite');

export interface IUser {
	id: number;
	sub: string;
	iss: string;
	name: string;
	email: string;
	email_verified: boolean;
	picture: string;
	name_finalized: boolean;
}

export const getUserByCookie = (cookies: Cookies) => {
	const sess = getSession(cookies);
  if (!sess)
    return null;
	return db.query('SELECT * FROM users WHERE id = ?').get(sess.user_id) as IUser;
};

export const getUserByIdentity = (iss: string, sub: string) =>
	db.query('SELECT * FROM users WHERE iss = ? AND sub = ?').get(iss, sub) as IUser | undefined;

export const getUserByEmail = (email: string) =>
	db.query('SELECT * FROM users WHERE email = ?').get(email) as IUser | undefined;

export const addUser = (user: IUser) =>
	db
		.prepare(
			'INSERT INTO users (name, sub, iss, picture, email, email_verified) VALUES ($name, $sub, $iss, $picture, $email, $email_verified)'
		)
		.values({
			$name: user.name,
			$sub: user.sub,
			$iss: user.iss,
			$email: user.email,
			$email_verified: user.email_verified,
			$picture: user.picture
		});
