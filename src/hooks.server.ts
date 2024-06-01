import { error, redirect, type Handle } from '@sveltejs/kit';
import { Logger } from '$lib/logger';
import { HandleCallback, HandleSignIn, addUser, getUserByClaims } from '$lib/auth';
import { deleteSession, createSession } from '$lib/db/sessions';
import { env } from '$env/dynamic/private';
import { generateUsername } from '$lib/username';
import { sequence } from '@sveltejs/kit/hooks';

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
			createSession(e, user.id);

			return redirect(302, '/');
		}

		case '/signout':
			deleteSession(e);
			return await resolve(e);

		default:
			return await resolve(e);
	}
};

export const handle: Handle = sequence(auth);
