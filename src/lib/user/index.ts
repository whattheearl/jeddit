
import { type Handle } from "@sveltejs/kit";
import { users } from "$lib/db/schema";
import { db } from "$lib/db";

export interface IUser {
    id: number;
    username: string;
    email: string;
}

export const userHandler: Handle = async ({ event, resolve }) => {
    if (!event.locals.oauth)
        return resolve(event);

    let user = await findUser(
        event.locals.oauth.claims.sub, 
        event.locals.oauth.authority, 
        event.locals.oauth.client_id
    );

    if (!user) {
        await createUser(
            event.locals.oauth.claims.sub, 
            event.locals.oauth.authority, 
            event.locals.oauth.client_id,
            event.locals.oauth.claims.email,
        );
        user = await findUser(
            event.locals.oauth.claims.sub, 
            event.locals.oauth.authority, 
            event.locals.oauth.client_id
        );
    }

    event.locals.user = {
        id: user?.id ?? -1,
        username: user?.username ?? '',
        email: user?.email ?? '',
    }

    return resolve(event);
}

export async function findUser(authority: string, client_id: string, sub: string) {
    return await db.query.users.findFirst({
        where: ((users, { eq, and }) => and(
            eq(users.sub, sub),
            eq(users.authority, authority),
            eq(users.clientId, client_id)
        )),
    });
}

export async function createUser(authority: string, client_id: string, sub: string, email: string) {
    await db.insert(users).values({
        authority: authority,
        clientId: client_id,
        sub: sub,
        email: email,
    });
}