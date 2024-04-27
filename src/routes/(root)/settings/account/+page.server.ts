import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { base } from "$app/paths";
import { Database } from 'bun:sqlite';
import { Logger } from "$lib/logger";

const db = new Database('./db.sqlite');
const logger = Logger('settings.account')

export const load: PageServerLoad = async ({ cookies }) => {
  const sid = cookies.get('sid') as string;
  const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: sid }) as any;
  if (!session)
    return redirect(302, '/');

  const user = db.query('SELECT * FROM users WHERE id = $id').get({ $id: session.user_id }) as any;
  logger.info('user', { ...user, picture: null });
  return { user };
}


export const actions: Actions = {
  // update user account settings
  default: async ({ cookies, request }) => {
    const sid = cookies.get('sid') as string;
    const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: sid }) as any;
    if (!session)
      return redirect(302, '/');

    let user = db.query('SELECT * FROM users WHERE id=$id').get({ $id: session.user_id }) as any
    if (user.name_finalized)
      return error(400, 'name is already set');

    if (!user)
      return redirect(302, `${base}/`);

    const formData = await request.formData();
    const name = formData.get('name');
    if (!name || !name.toString())
      error(400, 'name is required');

    const existingUser = db.query('SELECT id FROM users WHERE name = $name').get({
      $name: name.toString(),
    });
    if (existingUser)
      error(400, 'name is already taken');

    user.name = name.toString();
    db.run('UPDATE users SET name=?, name_finalized=1 WHERE id=?', [name.toString(), user.id]);
    user = db.query('SELECT * FROM users WHERE id=$id').get({ $id: session.user_id }) as any

    return {
      user
    };
  }
}
