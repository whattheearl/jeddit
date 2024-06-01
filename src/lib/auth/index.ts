import { Logger } from '../logger';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import {
	generateAuthorizationUrl,
	generateTokenUrl,
	getDiscoveryDocument,
	getTokensAsync,
	hashCodeChallenge
} from './oauth';
import { env } from '$env/dynamic/private';
import { getJwks, verifyJwt } from './jwt';
import { DeleteOauth, GetOauth, SaveOauth as SaveOauth } from '../db/oauths';
import { createSession } from '../db/sessions';
import { generateRandomBytes } from '$lib/crypto';

export * from '../db/users';
export { getSession } from '../db/sessions';

export interface HandleCallbackConfig {
	authority: string;
	client_id: string;
	client_secret: string;
	redirect_url: string;
}

export const HandleCallback = async (
	e: RequestEvent,
	{ authority, client_id, client_secret, redirect_url }: HandleCallbackConfig
) => {
	const logger = Logger('HandleCallback');

	const { code_verifier, nonce, state } = GetOauth(e);

	const code = e.url.searchParams.get('code');
	logger.debug('code', code);
	if (!code) error(400, '[code] missing');

	const stateParam = e.url.searchParams.get('state') as string;
	if (stateParam != state) error(400, `state does not match [${stateParam}] [${state}]`);

	const wellKnown = `${authority}/.well-known/openid-configuration`;
	const discoveryDocument = await getDiscoveryDocument(wellKnown);

	const token_url = generateTokenUrl(
		discoveryDocument.token_endpoint,
		code,
		client_id,
		client_secret,
		redirect_url,
		code_verifier
	);

	const tokens = await getTokensAsync(token_url);
	if (!tokens.id_token)
		error(
			500,
			`Unable to retrieve access_token from authorization server [${discoveryDocument.token_endpoint}]`
		);

	logger.info('verify token and get claims');
	const jwks = await getJwks(discoveryDocument.jwks_uri);

	const claims = await verifyJwt(jwks, tokens.id_token, {
		issuer: authority as string,
		audience: client_id as string
	});

	if (claims.nonce != nonce) error(400, '[nonce] does not match');

	DeleteOauth(e);
	return claims;
};

export interface HandleSignInConfig {
	authority: string;
	client_id: string;
	redirect_uri: string;
}

export const HandleSignIn = async (
	e: RequestEvent,
	{ authority, client_id, redirect_uri }: HandleSignInConfig
) => {
	const logger = Logger('HandleCallback');
	if (!authority) error(400, 'Missing authority');

	if (!client_id) error(400, 'Missing client_id');

	if (!redirect_uri) error(400, 'Missing redirect_uri');

	const wellKnown = `${authority}/.well-known/openid-configuration`;
	const discoveryDocument = await getDiscoveryDocument(wellKnown);
	if (!discoveryDocument) error(500, `Unable to retrieve discovery document at [${wellKnown}]`);

	const code_verifier = generateRandomBytes(64);
	const nonce = generateRandomBytes(64);
	const state = generateRandomBytes(64);

	SaveOauth(e, { code_verifier, nonce, state });

	const redirectUri = generateAuthorizationUrl(
		discoveryDocument.authorization_endpoint,
		env.google_client_id as string,
		env.google_redirect_url as string,
		await hashCodeChallenge(code_verifier),
		nonce,
		state
	);

	logger.debug(`redirectUri [${redirectUri}]`);

	redirect(302, redirectUri);
};
