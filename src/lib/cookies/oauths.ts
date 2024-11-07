import { dev } from '$app/environment';
import { type RequestEvent } from '@sveltejs/kit';

const cookieName = 'oauth';

export interface OauthData {
    code_verifier: string;
    nonce: string;
    state: string;
}

export const GetOauth = ({ cookies }: RequestEvent) => {
    return JSON.parse(cookies.get(cookieName) as string) as OauthData;
};

export const SaveOauth = ({ cookies }: RequestEvent, data: OauthData) => {
    const cookieValue = JSON.stringify(data);
    cookies.set(cookieName, cookieValue, {
        path: '/',
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax'
    });
};

export const DeleteOauth = ({ cookies }: RequestEvent) => {
    cookies.delete(cookieName, { path: '/' });
};
