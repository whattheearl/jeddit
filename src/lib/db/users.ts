import { db } from './_db';

export type IUser = {
    id: number;
    iss: string;
    sub: string;
    username: string;
    username_finalized: boolean;
    email: string;
    email_verified: boolean;
    picture: string;
};

export const addUser = (user: Partial<IUser>) => {
    db.prepare(
        `
        INSERT INTO users (username, sub, iss, username, username_finalized, email, email_verified, picture) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
        user.username ?? '',
        user.sub ?? '',
        user.iss ?? '',
        user.username ?? '',
        user.username_finalized ? 1 : 0,
        user.email ?? '',
        user.email_verified ? 1 : 0,
        user.picture ?? ''
    );
};

export const getAllUsers = () => {
    const users = db.prepare('SELECT * FROM users').all();
    return users;
};

export const getUserById = (id: number) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as IUser | null;
    return user;
};

export const getUserByClaims = (c: { iss?: string; sub?: string }) => {
    const user = db
        .prepare('SELECT * FROM users WHERE iss = ? AND sub = ?')
        .get(c.iss, c.sub) as IUser | null;
    return user;
};

export const getUserByEmail = (email: string) => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as IUser | null;
    return user;
};

export const getUserByUsername = (username: string) => {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as IUser | null;
    return user;
};
