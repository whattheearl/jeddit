const enc = new TextEncoder();
const secret = enc.encode('SECRET_STRING');
const text = enc.encode('I love cupcakes');
export const key = await crypto.subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    secret,
    {
        // algorithm details
        name: 'HMAC',
        hash: { name: 'SHA-512' }
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
);

export const signature = await crypto.subtle.sign('HMAC', key, text);

export const verify = await crypto.subtle.verify('HMAC', key, signature, text);
console.log({ secret, text, key, signature, verify });
