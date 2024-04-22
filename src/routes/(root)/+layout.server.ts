import { Logger } from "$lib/logger";
import type { LayoutServerLoad } from "./$types";
import { Database } from 'bun:sqlite';

const logger = Logger('layout.server.load');

export const load: LayoutServerLoad = ({ cookies }) => {
  const sid = cookies.get('sid') as string;
  const db = new Database('./db.sqlite');
  const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: sid }) as any;
  logger.debug('session', session);
  if (!session)
    return {};

  const user = db.query('SELECT * FROM users WHERE id = $id').get({ $id: session.user_id }) as any;
  logger.info('user', { ...user, picture: null });

  return { user }
}
