import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { base } from "$app/paths";
import { findUserById, findUserByUsername, updateUser } from "$lib/db/users";
import { setUserSession } from "$lib/session";

export const load: PageServerLoad = (event) => {
  if (!event.locals.user)
    return redirect(302, `${base}/`)

  return {
    user: event.locals.user
  }
}


export const actions: Actions = {
  // update user account settings
  default: async (event) => {
    if (!event.locals.user)
      return redirect(302, `${base}/`);

    const formData = await event.request.formData();
    const username = formData.get('username');
    if (!username || !username.toString())
      error(400, 'Username is required');

    const existingUser = await findUserByUsername(username.toString());
    if (existingUser)
      error(400, 'Username is already taken');

    const user = await findUserById(event.locals.user.id);
    if (!user)
      error(404, 'User not found');

    user.username = username.toString();

    await updateUser(event.locals.user.id, user);
    await setUserSession(event, user);

    return {};
  }
}
