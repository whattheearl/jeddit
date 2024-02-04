import * as jose from 'jose';

const EXPIRATION = '30d';

export const encryptToken = async (payload: jose.JWTPayload, sessionSecret: string, expiration: string = EXPIRATION) => {
	const secret = jose.base64url.decode(sessionSecret);
	const jwt = await new jose.EncryptJWT(payload)
		.setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
		.setIssuedAt()
		.setExpirationTime(expiration)
		.encrypt(secret);
	return jwt;
};

export const decryptToken = async (jwt: string, sessionSecret: string) => {
	const secret = jose.base64url.decode(sessionSecret);
	const { payload } = await jose.jwtDecrypt(jwt, secret);
	return payload;
};
