import Database from 'better-sqlite3'
import type { IClaims } from '$lib/auth/jwt';

const db = new Database('db.sqlite');

export type IUser = {
	id: number;
	iss: string;
	sub: string;
	username: string;
	username_finalized: boolean;
	email: string;
	email_verified: boolean;
	picture: string;
};

export const addUser = (user: Partial<IUser>) => {
	db.run(
		`
    INSERT INTO users (username, sub, iss, username, username_finalized, email, email_verified, picture) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
		[
			user.username ?? '',
			user.sub ?? '',
			user.iss ?? '',
			user.username ?? '',
			user.username_finalized ?? false,
			user.email ?? '',
			user.email_verified ?? false,
			user.picture ?? ''
		]
	);
};
export const getUserById = (id: number) =>
	db.query('SELECT * FROM users WHERE id = $id').get({ $id: id }) as IUser | null;
export const getUserByClaims = (c: IClaims) =>
	db
		.query('SELECT * FROM users WHERE iss = $iss AND sub = $sub')
		.get({ $iss: c.iss, $sub: c.sub }) as IUser | null;
export const getUserByEmail = (email: string) =>
	db.query('SELECT * FROM users WHERE email = ?').get(email) as IUser | null;
export const getUserByUsername = (username: string) =>
	db.query('SELECT * FROM users WHERE username = ?').get(username) as IUser | null;
