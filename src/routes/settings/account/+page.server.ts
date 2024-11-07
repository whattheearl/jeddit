import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { base } from '$app/paths';
import { getSession } from '$lib/db/sessions';
import { db } from '$lib/db/_db';

export const load: PageServerLoad = async (e) => {
    const { user } = getSession(e);
    if (!user) return redirect(302, '/');
    return { user };
};

export const actions: Actions = {
    default: async (e) => {
        const { user } = getSession(e);
        if (!user) {
            return redirect(302, '/');
        }

        if (user.username_finalized) {
            return error(400, 'name is already set');
        }

        if (!user) {
            return redirect(302, `${base}/`);
        }

        const { request } = e;
        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        if (!name) {
            error(400, 'name is required');
        }

        const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(name);
        if (existingUser) {
            error(400, 'name is already taken');
        }

        user.username = name;
        db.prepare('UPDATE users SET username = ?, username_finalized = 1 WHERE id = ?').run(
            name,
            user.id
        );

        return {
            user
        };
    }
};
