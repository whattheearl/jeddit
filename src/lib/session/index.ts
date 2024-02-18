import { base } from "$app/paths";
import { type RequestEvent } from "@sveltejs/kit";
import { decryptToken, encryptToken } from "./jwe";
import { env } from "$env/dynamic/private";
import type { IUser } from "$lib/user";

const USER_CLAIMS_COOKIE = "uc";

export async function getUserSession(event: RequestEvent) {
    if (event.locals.user)
        return event.locals.user;

    const userClaimToken = event.cookies.get(USER_CLAIMS_COOKIE);
    if (!userClaimToken)
        return null;

    const claims = await decryptToken(userClaimToken as string, env.session_secret as string);

    event.locals.user = claims as any;
    
    return claims as any as IUser;
}

export async function setUserSession(event: RequestEvent, user: IUser) {
    const token = await encryptToken(user as any, env.session_secret as string);

    event.cookies.set(USER_CLAIMS_COOKIE, token, {
        httpOnly: true,
        path: `${base}/`,
        sameSite: 'strict'
    });

    event.locals.user = user;
}

export function removeSession(event: RequestEvent) {
    event.cookies.delete(USER_CLAIMS_COOKIE, {
        httpOnly: true,
        path: `${base}/`,
        sameSite: 'strict'
    });
}
