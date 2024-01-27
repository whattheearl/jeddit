import { base } from "$app/paths";
import { getAuthorizationUrl, getUserInfo } from "$lib/oauth4webapi";
import { redirect, type Handle, error } from "@sveltejs/kit";

export const oauthHandler: Handle = async ({ event, resolve }) => {
    switch (event.url.pathname) {
        case `${base}/auth/google/signin`:
            {
                const referer = event.url.searchParams.get('referer') ?? `${base}/`;
                const redirect_user_url = referer.includes(event.url.hostname) ? referer : `${base}`;
                const { authorizationUrl, code_verifier } = await getAuthorizationUrl();
                event.cookies.set('oauth', JSON.stringify({ code_verifier, redirect_user_url }), { path: `${base}/auth` })
                redirect(302, authorizationUrl);
            }
        case `${base}/auth/google/callback`:
            {
                const cookie = event.cookies.get('oauth');
                if (!cookie)
                    error(400, 'Something went wrong...');
                const { code_verifier, redirect_user_url } = JSON.parse(cookie);
                const userinfo = await getUserInfo(event.url, code_verifier);
                console.log({ claims: userinfo })
                redirect(302, redirect_user_url);
            }
    }
    return await resolve(event);
}


