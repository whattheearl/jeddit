import { base } from "$app/paths";
import { redirect, type Handle, error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getUserSession, removeSession, setUserSession } from "$lib/session";
import { createUser, findUser } from "$lib/user";
import { getFlow, getProvider, getAuthorizationUrl, getOidcClaims } from "$lib/auth";


export const handle: Handle = async ({ event, resolve }) => {
  // check user session
  await getUserSession(event);

  // handle auth flow
  if (!event.url.pathname.startsWith(`${base}/auth`))
    return resolve(event);

  const flow = getFlow(event);
  switch (flow) {
    case 'signin':
      {
        const provider = getProvider(event);
        const { authorizationUrl, code_verifier } = await getAuthorizationUrl(
          provider.authority,
          provider.client_id,
          provider.client_secret,
          provider.redirect_uri
        );

        let referer = event.url.searchParams.get('referer') ?? `${env.host}${base}/`;
        const redirect_user_url = referer.includes(event.url.hostname) ? referer : `${base}/`;
        
        event.cookies.set('oauth', JSON.stringify({ code_verifier, redirect_user_url }), { path: `${base}/auth` })

        return redirect(302, authorizationUrl);
      }
    case 'callback':
      {
        const cookie = event.cookies.get('oauth');
        if (!cookie)
          error(400, 'Something went wrong. Please try again...');

        const provider = getProvider(event);

        const { code_verifier, redirect_user_url } = JSON.parse(cookie);
        const claims = await getOidcClaims(
          provider.authority,
          provider.client_id,
          provider.client_secret,
          provider.redirect_uri,
          event.url,
          code_verifier
        );

        let user = await findUser(provider.authority, provider.client_id, claims.sub);
        user = user ?? await createUser(provider.authority, provider.client_id, claims.sub, claims.email ?? '');

        await setUserSession(event, user);
        
        return redirect(302, redirect_user_url)
      }
    case 'signout':
      {
        removeSession(event);
        return resolve(event);
      }
    default:
      {
        return error(400, `flow not found: '${flow}'`);
      }

  }
}