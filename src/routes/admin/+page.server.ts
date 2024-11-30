import { getSession } from '$lib/db/sessions';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getAllUsers } from '$lib/db/users';

export const load: PageServerLoad = (e) => {
    const { user } = getSession(e);

    if (!user || user.email != 'earl.jonathan@gmail.com') {
        redirect(302, '/unauthorized');
    }

    const users = getAllUsers();
    return {
        user,
        users
    };
};
