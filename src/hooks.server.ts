import { error, redirect, type Handle } from '@sveltejs/kit';
import { Logger } from '$lib/logger';
import { HandleCallback, HandleSignIn, addUser, getUserByClaims } from '$lib/auth';
import { deleteSession, updateSession } from '$lib/stores/sessions.store';
import { env } from '$env/dynamic/private';
import { generateUsername } from '$lib/username';
import { sequence } from '@sveltejs/kit/hooks';
import { createCsrfToken, getCsrfToken, setCsrfToken, verifyCsrfToken } from '$lib/csrf';

export const auth: Handle = async ({ event: e, resolve }) => {
  const logger = Logger('handle');
  logger.info('url', { url: e.url.toString() });
  switch (e.url.pathname) {
    case '/auth/google/signin': {
      return await HandleSignIn(e, {
        authority: env.google_authority,
        client_id: env.google_client_id as string,
        redirect_uri: env.google_redirect_url as string
      });
    }

    case '/auth/google/callback': {
      const claims = await HandleCallback(e, {
        authority: env.google_authority,
        client_id: env.google_client_id,
        client_secret: env.google_client_secret,
        redirect_url: env.google_redirect_url
      });

      let user = getUserByClaims(claims);

      if (!user) {
        logger.debug('Usernot found, creating user');

        const res = await fetch(claims.picture);
        const buf = await res.arrayBuffer();
        const picture = Buffer.from(buf).toString('base64');

        addUser({
          username: generateUsername(),
          ...claims,
          picture
        });
      }

      user = user ?? getUserByClaims(claims);
      if (!user) return error(500, 'could not create user');

      logger.info('updating session:', { user_id: user.id });
      updateSession(e, user.id);

      const sid = e.cookies.get('sid') ?? '';
      const csrfToken = await createCsrfToken(sid) as string;
      setCsrfToken(e.cookies, csrfToken);

      return redirect(302, '/');
    }

    case '/signout':
      deleteSession(e);
      return await resolve(e);

    default:
      return await resolve(e);
  }
};

const forbidResponse = () => new Response(`Cross-site POST form submissions are forbidden`, { status: 403 });

export const csrf: Handle = async ({ event, resolve }) => {
  const logger = Logger('csrf');
  const { request, cookies } = event;

  logger.info('csrf');
  const contentType = request.headers.get('content-type')?.split(';')[0];
  const shouldValidate =
    request.method === 'POST' &&
    (contentType == 'application/x-www-form-urlencoded' || contentType == 'multipart/form-data');
  logger.info(`shouldValidate ${shouldValidate}`);
  if (!shouldValidate) return resolve(event);

  const clonedRequest = event.request.clone();
  const formData = await event.request.formData();
  const csrf = formData.get('csrf');
  logger.info(`csrf: ${csrf?.toString()}`)
  const csrfToken = getCsrfToken(cookies) ?? '';
  logger.info('csrftoken', { csrfToken })

  const tokesMatch = !!csrf && csrf == csrfToken;
  logger.info('tokesnmatch', { tokesMatch })
  if (!tokesMatch) return forbidResponse()
    
  const sid = cookies.get('sid') ?? '';
  const sessionId = await verifyCsrfToken(csrfToken);
  logger.info('csrftoken, sid', { sid, sessionId });
  
  
  if (sessionId != sid) return forbidResponse();
  event.request = clonedRequest;
  return await resolve(event);
}

export const handle: Handle = sequence(auth, csrf)
