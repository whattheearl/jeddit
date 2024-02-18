import { base } from '$app/paths';
import { env } from '$env/dynamic/private';
import { error, type RequestEvent } from '@sveltejs/kit';

export interface IProvider {
	name: string;
	authority: string;
	client_id: string;
	client_secret: string;
	redirect_uri: string;
}

export const providers: Partial<IProvider>[] = [
	{
		name: 'google',
		authority: 'https://accounts.google.com'
	}
];

export function getProvider(event: RequestEvent) {
	const path = event.url.pathname.slice(base.length);
	const parts = path.split('/');
	if (parts.length < 3) error(400, `Unable to parse provider from path: '${parts}'`);

	const providerName = parts[2];
	if (!providerName) error(400, `No provider name provided'`);

	const filtered = providers.filter((p) => p.name === providerName);
	if (filtered.length != 1) error(400, `Not able to resolve provider: '${providerName}'`);

	const client_id = env[`${providerName}_client_id`];
	if (!client_id) error(400, `${providerName}_client_id missing`);

	const client_secret = env[`${providerName}_client_secret`];
	if (!client_secret) error(400, `${providerName}_client_secret missing`);

	return {
		...filtered[0],
		client_id,
		client_secret,
		redirect_uri: `${env.host}${base}/auth/${providerName}/callback`
	} as IProvider;
}
