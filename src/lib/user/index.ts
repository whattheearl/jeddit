
import { users } from "$lib/db/schema";
import { db } from "$lib/db";

export interface IUser {
    id: number;
    sub: string;
    authority: string;
    username: string;
    email: string;
}

export async function findUser(authority: string, client_id: string, sub: string) {
    const dbUser = await db.query.users.findFirst({
        where: ((users, { eq, and }) => and(
            eq(users.sub, sub),
            eq(users.authority, authority),
            eq(users.clientId, client_id)
        )),
    });
    if (!dbUser)
        return null;

    return mapDbUserToUser(dbUser);
}

export async function createUser(authority: string, client_id: string, sub: string, email: string) {
    const dbUser = await db.insert(users).values({
        authority: authority,
        clientId: client_id,
        sub: sub,
        email: email,
    });
    if (!dbUser)
        return null;
    
    return mapDbUserToUser(dbUser);
}

function mapDbUserToUser(dbUser: any) {
    if (!dbUser)
        return null;

    return {
        id: dbUser?.id ?? '',
        sub: dbUser?.sub ?? '',
        authority: dbUser?.authority ?? '',
        username: dbUser?.username ?? '',
        email: dbUser?.email ?? '',
    } as IUser;
}