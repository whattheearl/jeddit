import { deleteSession } from '$lib/stores/sessions.store';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (e) => {
	deleteSession(e);
	return {};
};
