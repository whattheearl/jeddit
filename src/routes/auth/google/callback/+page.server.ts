import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import { Logger } from '$lib/logger';
import { generateTokenUrl, getDiscoveryDocument, getTokensAsync, getClaims } from '$lib/auth';
import { generateUsername } from '$lib/namer';

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

	const sid = cookies.get('sid') as string;
	logger.debug('sid', sid);
	const db = new Database('./db.sqlite');
	const session = db.query('SELECT * FROM sessions WHERE id = $sid').get({ $sid: sid }) as any;

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

	let res = await fetch(claims.picture);
	const buf = await res.arrayBuffer();
	const picture = Buffer.from(buf);

	let user = db
		.query('SELECT * FROM users WHERE sub = $sub AND iss = $iss')
		.get({ $sub: claims.sub, $iss: claims.iss }) as any;
	logger.debug('initial user lookup', { sub: claims.sub, iss: claims.iss });

	if (!user) {
		logger.debug('user not found... creating user...');
		db.prepare(
			`
      INSERT INTO users (name, sub, iss, picture, email, email_verified) 
      VALUES ($name, $sub, $iss, $picture, $email, $email_verified)
    `
		).run({
			$name: generateUsername(),
			$sub: claims.sub,
			$iss: claims.iss,
			$email: claims.email,
			$email_verified: claims.email_verified,
			$picture: picture.toString('base64')
		});
	}

	user =
		user ??
		(db.query('SELECT * FROM users WHERE email = $email').get({ $email: claims.email }) as any);
	logger.info('user found:', user);

	logger.debug('updating session', { user_id: user.id, sid });
	db.prepare('UPDATE sessions SET user_id = $user_id WHERE id == $sid').values({
		$sid: sid,
		$user_id: user.id
	});

	redirect(302, '/');
};
