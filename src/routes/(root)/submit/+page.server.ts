import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { Database } from 'bun:sqlite';

export const actions: Actions = {
  default: async (event) => {
    const db = new Database('db.sqlite');

    const sid = event.cookies.get('sid') as string;
    const session = db.query('SELECT * FROM sessions WHERE id = $sid').values({ $sid: sid }) as any;
    if (!session)
      redirect(302, '/')

    const formData = await event.request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    console.log({ title, content })
    if (!title)
      return { title, content };

    db.prepare(`INSERT INTO posts (author_id, title, content) VALUES ($author_id, $title, $content)`)
      .values({ $author_id: session.user_id, $title: title, $content: content });

    return {};
  }
}
