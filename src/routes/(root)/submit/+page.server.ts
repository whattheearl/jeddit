import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { Database } from 'bun:sqlite';

export const actions: Actions = {
  default: async (event) => {
    const db = new Database('db.sqlite');

    const sid = event.cookies.get('sid') as string;
    const session = db.query('SELECT * FROM sessions WHERE id = $sid').get({ $sid: sid }) as any;
    if (!session)
      redirect(302, '/')

    const formData = await event.request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    console.log({ title, content })
    if (!title)
      return { title, content };

    const community_id = 1; //jeddit hardcoded`

    const now = Date.now();
    db.prepare(`INSERT INTO posts (user_id, title, community_id, content, createdAt) 
      VALUES ($user_id, $title, $community_id, $content, $createdAt)`
    ).values({ $user_id: session.user_id, $community_id: community_id, $title: title, $content: content, $createdAt: now });

    redirect(302, '/');
  }
}
