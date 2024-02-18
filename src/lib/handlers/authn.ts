import { getAuthorizationUrl, getOidcClaims, getProvider, getFlow } from '$lib/auth';
import { base } from '$app/paths';
import { redirect, type Handle, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getUserSession, setUserSession, removeSession } from '$lib/session';
import { createUser, findUser } from '$lib/db/users';

export const authnHandler: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith(`${base}/auth`)) {
    const user = await getUserSession(event);
    event.locals.user = user;
    return resolve(event);
  }

  const flow = getFlow(event);
  switch (flow) {
    case 'signin': {
      const provider = getProvider(event);
      const { authorizationUrl, code_verifier } = await getAuthorizationUrl(
        provider.authority,
        provider.client_id,
        provider.client_secret,
        provider.redirect_uri
      );

      let referer = event.url.searchParams.get('referer') ?? `${env.host}${base}/`;
      const redirect_user_url = referer.includes(event.url.hostname) ? referer : `${base}/`;

      event.cookies.set('oauth', JSON.stringify({ code_verifier, redirect_user_url }), {
        path: `${base}/auth`
      });

      return redirect(302, authorizationUrl);
    }
    case 'callback': {
      const cookie = event.cookies.get('oauth');
      if (!cookie) error(400, 'Something went wrong. Please try again...');

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

      let user = await getUserSession(event);
      user = user ?? (await findUser(provider.authority, provider.client_id, claims.sub));
      user =
        user ??
        (await createUser(
          provider.authority,
          provider.client_id,
          claims.sub,
          claims.email as string
        ));
      await setUserSession(event, user as any);
      const redirectUrl = !event?.locals?.user?.username
        ? `${base}/settings/account`
        : redirect_user_url;
      return redirect(302, redirectUrl);
    }
    case 'signout': {
      await removeSession(event);
      return redirect(302, `${base}/`);
    }
    default: {
      return error(400, `flow not found: '${flow}'`);
    }
  }
};
