import { users } from '$lib/db/schema';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export interface IUser {
	id: number;
	sub: string;
	authority: string;
	username: string;
	email: string;
}

export async function findUser(authority: string, client_id: string, sub: string) {
	const dbUser = await db.query.users.findFirst({
		where: (users, { eq, and }) =>
			and(eq(users.sub, sub), eq(users.authority, authority), eq(users.clientId, client_id))
	});
	return mapDbUserToUser(dbUser);
}

export async function findUserById(id: number | undefined) {
  if (!id) return null;
  const dbUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id)
	});
  return mapDbUserToUser(dbUser);
}

export async function findUserByUsername(username: string) {
	const dbUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username)
	});
	return mapDbUserToUser(dbUser);
}

export async function createUser(authority: string, client_id: string, sub: string, email: string) {
	const dbUser = await db.insert(users).values({
		authority: authority,
		clientId: client_id,
		sub: sub,
		email: email
	});
	return mapDbUserToUser(dbUser);
}

export async function updateUser(id: number, user: IUser) {
	const dbUser = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id)
	});
	if (!dbUser)
		error(404, 'User not found');

	dbUser.username = user.username;
	await db.update(users)
		.set({ username: user.username })
		.where(eq(users.id, user.id))
}

function mapDbUserToUser(dbUser: any) {
	if (!dbUser) return null;

	return {
		id: dbUser?.id ?? '',
		sub: dbUser?.sub ?? '',
		authority: dbUser?.authority ?? '',
		username: dbUser?.username ?? '',
		email: dbUser?.email ?? ''
	} as IUser;
}
