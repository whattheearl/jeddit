import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Logger } from '$lib/logger';
import { generateTokenUrl, getDiscoveryDocument, getTokensAsync, getClaims } from '$lib/auth';
import { generateUsername } from '$lib/namer';
import { addUser, getUserByEmail, getUserByIdentity, type IUser } from '$lib/user';
import { getSession, updateSession, type ISession } from '$lib/session';

const logger = Logger('oauth.google.callback');

export const load: PageServerLoad = async ({ url, cookies }) => {
	// try catch here will cause issues with redirects
	const discoveryDocument = await getDiscoveryDocument(
		'https://accounts.google.com/.well-known/openid-configuration'
	);
	if (!discoveryDocument)
		error(
			500,
			'Unable to retrieve discovery document at [https://accounts.google.com/.well-known/openid-configuration]'
		);

	const code = url.searchParams.get('code');
	logger.debug('code', code);
	if (!code) error(400, 'searchParam [code] missing');

	const session = getSession(cookies);
	logger.info('session', session);
	if (!session) redirect(302, '/');

	const endpoint = generateTokenUrl(
		discoveryDocument.token_endpoint,
		code,
		env.google_client_id,
		env.google_client_secret,
		env.google_redirect_url,
		session.code_verifier
	);

	const tokens = await getTokensAsync(endpoint);
	if (!tokens.id_token)
		error(
			500,
			`Unable to retrieve access_token from authorization server [${discoveryDocument.token_endpoint}]`
		);

	const claims = await getClaims(
		tokens.id_token,
		discoveryDocument.jwks_uri,
		env.google_authority,
		env.google_client_id
	);
	if (!claims) error(401, 'Unauthorized');

	const res = await fetch(claims.picture);
	const buf = await res.arrayBuffer();
	const picture = Buffer.from(buf);

	let user = getUserByIdentity(claims.iss, claims.sub);
	logger.debug('initial user lookup', { sub: claims.sub, iss: claims.iss });

	if (!user) {
		logger.debug('user not found... creating user...');
		addUser({
			name: generateUsername(),
			sub: claims.sub,
			iss: claims.iss,
			email: claims.email,
			email_verified: claims.email_verified,
			picture: picture.toString('base64'),
			name_finalized: false
		} as IUser);
	}

	user = user ?? (getUserByEmail(claims.email) as IUser);
	logger.info('user found:', user);

	logger.debug('updating session', { user_id: user.id, session_id: session.id });
	updateSession(cookies, { user_id: user.id } as ISession);

	redirect(302, '/');
};
