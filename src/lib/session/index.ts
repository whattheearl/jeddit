import { base } from "$app/paths";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { decryptToken, encryptToken } from "./jwe";
import { env } from "$env/dynamic/private";
import { users } from "$lib/db/schema";
import { db } from "$lib/db";

const USER_CLAIMS_COOKIE = "uc";

export interface IUser {
    id: number;
    username: string;
}

export const localSessionHandler: Handle = async ({ event, resolve }) => {
    const session = await getSession(event);
    if (session) {
        event.locals.user = session;
        return resolve(event);
    }

    if (!event.locals.oauth)
        return resolve(event);

    // find user
    let user = await db.query.users.findFirst({
        where: ((users, { eq, and }) => and(
            eq(users.sub, event.locals.oauth.claims.sub),
            eq(users.authority, event.locals.oauth.authority),
            eq(users.clientId, event.locals.oauth.client_id)
        )),
    });

    if (!user) {
        // create user
        await db.insert(users).values({
            email: event.locals.oauth.claims.email,
            sub: event.locals.oauth.claims.sub,
            authority: event.locals.oauth.authority,
            clientId: event.locals.oauth.client_id,
        }) as any
        user = await db.query.users.findFirst({
            where: ((users, { eq, and }) => and(
                eq(users.sub, event.locals.oauth.claims.sub),
                eq(users.authority, event.locals.oauth.authority),
                eq(users.clientId, event.locals.oauth.client_id)
            )),
        });
    }
    
    // create session
    await setSession(event, user as any);
    event.locals.user = user as IUser;
    redirect(302, event.locals.oauth.redirect_url)
}

export async function getSession(event: RequestEvent) {
    const userClaimToken = event.cookies.get(USER_CLAIMS_COOKIE);
    if (!userClaimToken)
        return null;

    const claims = await decryptToken(userClaimToken as string, env.session_secret as string);
    return claims as any as IUser;
}

export async function setSession(event: RequestEvent, session: IUser) {
    const token = await encryptToken(session as any, env.session_secret as string);

    event.cookies.set(USER_CLAIMS_COOKIE, token, {
        httpOnly: true,
        path: `${base}/`,
        sameSite: 'strict'
    });
}
