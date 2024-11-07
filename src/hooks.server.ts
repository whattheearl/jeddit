import { error, redirect, type Handle } from '@sveltejs/kit';
import { Logger } from '$lib/logger';
import { HandleCallback, HandleSignIn } from '$lib/oidc';
import { deleteSession, createSession } from '$lib/db/sessions';
import { env } from '$env/dynamic/private';
import { generateUsername } from '$lib/username';
import { sequence } from '@sveltejs/kit/hooks';
import { addUser, getUserByClaims, type IUser } from '$lib/db/users';

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
                redirect_uri: env.google_redirect_url
            });
            console.log(claims);
            let user = getUserByClaims(claims);

            if (!user) {
                logger.debug('user not found, creating user');
                const newUser = {
                    ...claims,
                    username: generateUsername()
                } as IUser;
                console.log(claims.picture);
                if (claims.picture) {
                    try {
                        const res = await fetch(claims.picture as string);
                        const buf = await res.arrayBuffer();
                        const picture = Buffer.from(buf).toString('base64');
                        newUser.picture = picture;
                    } catch (err) {
                        console.error('failed to retrieve user photo', claims.picture);
                    }
                }

                addUser(newUser);
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
