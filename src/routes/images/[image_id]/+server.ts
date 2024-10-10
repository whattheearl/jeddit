import Database from 'better-sqlite3';

const db = Database('./db.sqlite');

/** @type {import('./$types').RequestHandler} */
export const GET = async (event) => {
    const id = event.params.image_id;
    const db = Database('./db.sqlite');
    const image = db.prepare('SELECT * FROM images WHERE id = ?').get(id) as any;
    if (!image) return new Response(undefined, { status: 404 });
    return new Response(image.image, { status: 200 });
};
