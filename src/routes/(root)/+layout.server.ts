import { getUserByCookie } from '$lib/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
  const user = getUserByCookie(cookies);
  return { user };
};
