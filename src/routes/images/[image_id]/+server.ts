import { db } from '$lib/db/_db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    const id = event.params.image_id;
    const image = db.prepare('SELECT * FROM images WHERE id = ?').get(id) as { image: string };

    if (!image) {
        return new Response('', { status: 404 });
    }

    return new Response(image.image, { status: 200 });
};
