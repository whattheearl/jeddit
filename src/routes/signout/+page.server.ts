import { deleteSession, getSession } from '$lib/db/sessions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (e) => {
    deleteSession(e);
    const { user } = getSession(e);
    return { user };
};
