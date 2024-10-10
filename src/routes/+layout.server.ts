import { getSession } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (e) => {
    const { user } = getSession(e);
    return { user };
};
