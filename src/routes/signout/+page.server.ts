import { deleteSession } from '$lib/db/sessions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (e) => {
	deleteSession(e);
	return {};
};
