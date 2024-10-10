async function importHMAC(jwk: JsonWebKey) {
    const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
    console.debug(key);
    return key;
}

async function verifyHMAC(jwt: string, key: CryptoKey) {
    const parts = jwt.split('.');
    if (parts.length != 3) throw new Error('invalid jwt');

    //const data = Buffer.from(`${parts[0]}.${parts[1]}`);
    const enc = new TextEncoder();
    const data = enc.encode(`${parts[0]}.${parts[1]}`);
    const signature = Buffer.from(parts[2], 'base64url');

    console.debug('data:', data.toString());
    console.debug('signature:', signature.toString());
    let result = await crypto.subtle.verify('HMAC', key, signature, data);

    return result;
}

// WARNING: dont use in prod
const tempKey = {
    alg: 'HS256',
    ext: true,
    k: 'R1fsIwbwOg9kQhnd6Jjl-PnqrmCiXDi2M53TwiASlvS4IYQmsL1SL-aFXa_zEDq0rY4LuEUnVlGVwTJZptEkrw',
    key_ops: ['sign', 'verify'],
    kty: 'oct'
};

export async function getIdentity(jws: string) {
    const key = await importHMAC(tempKey);
    console.debug('key:', key);
    const verify = await verifyHMAC(jws, key);
    console.debug('verify:', verify);
    if (!verify) return 'invalid sid';

    const body = jws.split('.')[1];
    return Buffer.from(body, 'base64url').toString('utf8');
}
