import { base } from "$app/paths";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import { decryptToken, encryptToken } from "./jwe";
import { env } from "$env/dynamic/private";
import type { IUser } from "$lib/user";

const USER_CLAIMS_COOKIE = "uc";

export const localSessionHandler: Handle = async ({ event, resolve }) => {
    // create session if user just created
    if (event.locals.user) {
        // create session
        await setSession(event, event.locals.user as any);
        event.locals.user = event.locals.user as IUser;
        redirect(302, event.locals.oauth.redirect_url ?? `${base}/`)
    }

    // resolve session if already created
    const session = await getSession(event);
    if (session)
        event.locals.user = session;
    
    return resolve(event);
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
