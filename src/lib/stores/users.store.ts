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
  db.prepare(
		`
    INSERT INTO users (username, sub, iss, username, username_finalized, email, email_verified, picture) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
		user.username ?? '',
		user.sub ?? '',
		user.iss ?? '',
		user.username ?? '',
		user.username_finalized ? 1 : 0,
		user.email ?? '',
		user.email_verified ? 1 : 0,
		user.picture ?? ''	
	);
};

export const getUserById = (id: number) =>
	db.prepare('SELECT * FROM users WHERE id = ?').get(id) as IUser | null;

export const getUserByClaims = (c: IClaims) =>
	db
		.prepare('SELECT * FROM users WHERE iss = ? AND sub = ?')
		.get(c.iss, c.sub) as IUser | null;

export const getUserByEmail = (email: string) =>
	db.prepare('SELECT * FROM users WHERE email = ?').get(email) as IUser | null;

export const getUserByUsername = (username: string) =>
	db.prepare('SELECT * FROM users WHERE username = ?').get(username) as IUser | null;

