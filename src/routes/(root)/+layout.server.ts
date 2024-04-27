import { getSession } from '$lib/session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const user = getSession(cookies);
	return { user };
};
