import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import Crypto from 'node:crypto';
import {
	hashCodeChallenge,
	generateCodeVerifier,
	getDiscoveryDocument,
	generateAuthorizationUrl
} from '$lib/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const discoveryDocument = await getDiscoveryDocument(
		'https://accounts.google.com/.well-known/openid-configuration'
	);
	if (!discoveryDocument)
		error(
			500,
			'Unable to retrieve discovery document at [https://accounts.google.com/.well-known/openid-configuration]'
		);

	const code_verifier = generateCodeVerifier();

	const sid = Crypto.randomUUID();
	cookies.set('sid', sid, { path: '/', httpOnly: true });

	const db = new Database('./db.sqlite');
	db.prepare('INSERT INTO sessions (id, code_verifier) VALUES ($sid, $code_verifier)').values({
		$sid: sid,
		$code_verifier: code_verifier
	});

	const redirectUri = generateAuthorizationUrl(
		discoveryDocument.authorization_endpoint,
		env.google_client_id as string,
		env.google_redirect_url as string,
		await hashCodeChallenge(code_verifier)
	);

	redirect(302, redirectUri);
};
