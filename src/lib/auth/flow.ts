import { base } from '$app/paths';
import { error, type RequestEvent } from '@sveltejs/kit';

const flows = ['signin', 'signout', 'callback'];

export function getFlow(event: RequestEvent) {
	if (event.url.pathname == '/auth/signout') return 'signout';

	const path = event.url.pathname.slice(base.length);
	const parts = path.split('/');
	if (parts.length < 4) error(400, `Unable to flow provider from path: '${parts}'`);
	const flow = parts[3];
	if (!flows.includes(flow)) error(400, `Flow not found: '${flow}'`);
	return flow;
}
