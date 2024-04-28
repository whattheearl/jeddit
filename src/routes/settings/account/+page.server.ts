import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { base } from '$app/paths';
import { Database } from 'bun:sqlite';
import { getSession } from '$lib/auth';

const db = new Database('./db.sqlite');

export const load: PageServerLoad = async (e) => {
  const { user } = getSession(e);
  if (!user) return redirect(302, '/');
  return { user };
};

export const actions: Actions = {
  // update user account settings
  default: async (e) => {
    const { user } = getSession(e);
    if (!user) return redirect(302, '/');

    if (user.username_finalized) return error(400, 'name is already set');

    if (!user) return redirect(302, `${base}/`);

    const { request } = e;
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    if (!name) error(400, 'name is required');

    const existingUser = db.query('SELECT id FROM users WHERE name = ?').get(name);
    if (existingUser) error(400, 'name is already taken');

    user.username = name;
    db.run('UPDATE users SET name=?, name_finalized=1 WHERE id=?', [name, user.id]);

    return {
      user
    };
  }
};
