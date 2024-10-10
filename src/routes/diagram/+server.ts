import { error } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

const db = Database('./db.sqlite');

export const POST: RequestHandler = async (event) => {
    const file = await event.request.blob();
    const str = await file.text();
    const buf = await file.arrayBuffer();
    const hash = crypto.createHash('md5').update(str).digest('hex');
    const fileType = 'webp';
    const fileName = `${hash}.${fileType}`;
    const imageId = db.prepare('SELECT id FROM images WHERE id = ?').get(fileName);
    if (imageId)
        return new Response(JSON.stringify({ imageurl: `/images/${fileName}` }), { status: 201 });
    const img = await sharp(buf).webp().toBuffer();
    db.prepare('INSERT INTO images (id,image,file_type,version) VALUES (?,?,?,?)').run(
        fileName,
        Buffer.from(img),
        fileType,
        '1'
    );
    return new Response(JSON.stringify({ imageurl: `/images/${fileName}` }), { status: 201 });
};
