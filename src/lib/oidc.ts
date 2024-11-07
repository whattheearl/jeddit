import { Logger } from '$lib/logger';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import * as jose from 'jose';
import { DeleteOauth, GetOauth, SaveOauth as SaveOauth } from '$lib/cookies/oauths';
import { generateRandomBytes } from '$lib/crypto';

export interface HandleCallbackConfig {
    authority: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
}

export const HandleCallback = async (
    e: RequestEvent,
    { authority, client_id, client_secret, redirect_uri }: HandleCallbackConfig
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

    const token_url = new URL(discoveryDocument.token_endpoint);
    token_url.searchParams.append('code', code);
    token_url.searchParams.append('client_id', client_id);
    token_url.searchParams.append('client_secret', client_secret);
    token_url.searchParams.append('redirect_uri', redirect_uri);
    token_url.searchParams.append('grant_type', 'authorization_code');
    token_url.searchParams.append('code_verifier', code_verifier);
    logger.debug('token_url', { token_url: token_url.toString() });

    const res = await fetch(token_url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log({ status: res.status });
    if (res.status != 200) {
        const errorResponse = await res.text();
        console.log('error response', errorResponse);
        error(
            500,
            `Unable to retrieve access_token from authorization server [${discoveryDocument.token_endpoint}]`
        );
    }

    const data = await res.json();
    logger.debug('token response', { data });
    const { id_token } = data;

    if (!id_token) {
        error(
            500,
            `Unable to retrieve access_token from authorization server [${discoveryDocument.token_endpoint}]`
        );
    }

    logger.info('verify token and get claims');
    const JWKS = jose.createRemoteJWKSet(new URL(discoveryDocument.jwks_uri));
    logger.info('token', { JWKS });
    const { payload } = await jose.jwtVerify(id_token, JWKS, {
        issuer: authority as string,
        audience: client_id as string
    });

    logger.info('payload', payload);
    if (payload.nonce != nonce) {
        error(400, '[nonce] does not match');
    }

    DeleteOauth(e);
    return payload;
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

    const code_challange = await hashCodeChallenge(code_verifier);
    const authorization_url = new URL(discoveryDocument.authorization_endpoint);
    authorization_url.searchParams.append('client_id', env!.google_client_id);
    authorization_url.searchParams.append('scope', 'email openid profile');
    authorization_url.searchParams.append('redirect_uri', env!.google_redirect_url);
    authorization_url.searchParams.append('response_type', 'code');
    authorization_url.searchParams.append('code_challenge', code_challange);
    authorization_url.searchParams.append('code_challenge_method', 'S256');
    authorization_url.searchParams.append('nonce', nonce);
    authorization_url.searchParams.append('state', state);
    logger.debug('generateAuthorizationUrl', authorization_url.toString());

    logger.debug(`redirectUri [${authorization_url.toString()}]`);
    redirect(302, authorization_url.toString());
};

export const hashCodeChallenge = async (code_verifier: string) => {
    const hashBuf = await crypto.subtle.digest('SHA-256', Buffer.from(code_verifier));
    return Buffer.from(hashBuf).toString('base64url');
};

export const getDiscoveryDocument = async (openid_configuration_endpoint: string) => {
    const res = await fetch(openid_configuration_endpoint);
    const discoveryDoc = (await res.json()) as {
        authorization_endpoint: string;
        token_endpoint: string;
        userinfo_endpoint: string;
        issuer: string;
        jwks_uri: string;
    };
    return discoveryDoc;
};
