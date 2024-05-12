import type { Cookies } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { generateRandomBytes } from "./crypto";

export const createCsrfToken = async (sessionId: string) => {
  if (!sessionId)
    return null;

  let enc = new TextEncoder();
  const secret = enc.encode(Bun.env.CSRF_SECRET);
  const key = await crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    secret,
    {
      name: "HMAC",
      hash: { name: "SHA-512" }
    },
    false, // export = false
    ["sign"] // what this key can do
  )
  const random = generateRandomBytes(16);
  const text = enc.encode(`${sessionId}!${random}`);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    text
  )
  return `${Buffer.from(signature).toString('base64url')}.${Buffer.from(text).toString()}`;
}

export const verifyCsrfToken = async (csrfToken: string) => {
  let enc = new TextEncoder();
  const secret = enc.encode(Bun.env.CSRF_SECRET);
  const key = await crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    secret,
    {
      name: "HMAC",
      hash: { name: "SHA-512" }
    },
    false, // export = false
    ["verify"] // what this key can do
  )
  const [signature, token] = csrfToken.split('.');

  const verify = await crypto.subtle.verify(
    'HMAC',
    key,
    Buffer.from(signature, 'base64url'),
    Buffer.from(token),
  )
  const tokenSessionId = token.split('!')[0];
  return tokenSessionId;
}

export const setCsrfToken = (cookie: Cookies, csrfToken: string) =>  cookie.set('csrf', csrfToken, { secure: !dev, path: '/' })

export const getCsrfToken = (cookies: Cookies) => cookies.get('csrf')
