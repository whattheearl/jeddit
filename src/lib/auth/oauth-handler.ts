import { base } from "$app/paths";
import { getAuthorizationUrl, getUserInfo } from "./oauth4webapi";
import { redirect, type Handle, error } from "@sveltejs/kit";
import { getProviderByName } from './providers';
import { env } from "$env/dynamic/private";
import { users } from "$lib/db/schema";
import { db } from "$lib/db/db";

export const oauthHandler: Handle = async ({ event, resolve }) => {
    // not auth
    if (!event.url.pathname.startsWith(`${base}/auth`))
        return resolve(event);

    const path = event.url.pathname.slice(base.length);
    const parts = path.split('/');
    if (parts.length < 4)
        error(400, `Unable to parse path: '${parts}'`);

    const providerName = parts[2];
    if (!providerName)
        error(400, `Not able to resolve provider: '${providerName}'`);

    const flow = parts[3];
    // use correct flow
    const provider = getProviderByName(providerName);
    if (!provider)
        error(500, `provider not found: '${providerName}'`);

    switch (flow) {
        case 'signin':
            {
                let referer = event.url.searchParams.get('referer') ?? `${env.host}${base}/`;
                const redirect_user_url = referer.includes(event.url.hostname) ? referer : `${base}/`;

                const { authorizationUrl, code_verifier } = await getAuthorizationUrl(
                    provider.authority,
                    provider.client_id,
                    provider.client_secret,
                    provider.redirect_uri
                );
                event.cookies.set('oauth', JSON.stringify({ code_verifier, redirect_user_url }), { path: `${base}/auth` })
                redirect(302, authorizationUrl);
            }
        case 'callback':
            const cookie = event.cookies.get('oauth');
            if (!cookie)
                error(400, 'Something went wrong. Please login again...');

            const { code_verifier, redirect_user_url } = JSON.parse(cookie);
            const userinfo = await getUserInfo(
                provider.authority,
                provider.client_id,
                provider.client_secret,
                provider.redirect_uri,
                event.url,
                code_verifier
            );
            console.log({ claims: userinfo });
            let user = await db.query.users.findFirst({
                where: ((users, { eq, and }) => and(
                    eq(users.sub, userinfo.sub),
                    eq(users.authority, provider.authority),
                    eq(users.clientId, provider.client_id)
                )),
            });
            console.log({ user })
            if (!user)
                await db.insert(users).values({
                    email: userinfo.email,
                    sub: userinfo.sub,
                    authority: provider.authority,
                    clientId: provider.client_id,
                })
            user = await db.query.users.findFirst({
                where: ((users, { eq, and }) => and(
                    eq(users.sub, userinfo.sub),
                    eq(users.authority, provider.authority),
                    eq(users.clientId, provider.client_id)
                )),
            });
            console.log({ user })
            redirect(302, redirect_user_url);

        default:
            {
                error(400, `flow not found: '${flow}'`);
            }

    }
}


