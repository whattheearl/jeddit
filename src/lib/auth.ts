import { Logger } from "./logger";
import crypto from 'node:crypto';

const logger = Logger('auth');

export const generateCodeVerifier = () => {
  const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(64))).toString('hex');
  return code_verifier;
}

export const hashCodeChallenge = (code_verifier: string) => {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(code_verifier);
  const buf = hasher.digest();
  const code_challenge = Buffer.from(buf.buffer).toString('base64url');
  return code_challenge
}

export const getDiscoveryDocument = async (openid_configuration_endpoint: string) => {
  try {
    logger.debug('openid_configuration_endpoint', { openid_configuration_endpoint })
    const res = await fetch(openid_configuration_endpoint);
    const discoveryDoc = await res.json() as {
      authorization_endpoint: string,
      token_endpoint: string,
      userinfo_endpoint: string,
      issuer: string,
      jwks_uri: string,
    };
    return discoveryDoc;
  } catch (err) {
    logger.error('failed to retrieve authorization endpoint', err);
    return null;
  }
}

export const generateAuthorizationUrl = (authorization_endpoint: string, client_id: string, redirect_uri: string, code_challenge: string) => {
  const endpoint = new URL(authorization_endpoint);
  endpoint.searchParams.append('client_id', client_id);
  endpoint.searchParams.append('scope', 'email openid profile');
  endpoint.searchParams.append('redirect_uri', redirect_uri);
  endpoint.searchParams.append('response_type', 'code');
  endpoint.searchParams.append('code_challenge', code_challenge);
  endpoint.searchParams.append('code_challenge_method', 'S256');
  logger.debug('generateAuthorizationUrl', endpoint.toJSON());
  return endpoint.toString();
}

export const generateTokenUrl = (token_endpoint: string, code: string, client_id: string, client_secret: string, redirect_uri: string, code_verifier: string) => {
  const endpoint = new URL(token_endpoint);
  endpoint.searchParams.append('code', code);
  endpoint.searchParams.append('client_id', client_id as string);
  endpoint.searchParams.append('client_secret', client_secret as string);
  endpoint.searchParams.append('redirect_uri', redirect_uri as string);
  endpoint.searchParams.append('grant_type', 'authorization_code');
  endpoint.searchParams.append('code_verifier', code_verifier);
  logger.debug('generateTokenUrl', endpoint.toJSON());
  return endpoint.toString();
}

export const getTokensAsync = async (token_uri: string) => {
  let res = await fetch(token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (res.status != 200) {
    logger.error('getTokensAsync response', await res.text());
    return { access_token: null, id_token: null };
  }

  const data = await res.json();
  logger.debug('token response', { data });
  const { access_token, id_token } = data;
  return { access_token, id_token };
}

export const getClaims = async (id_token: string, jwks_uri: string, issuer: string, audience: string) => {
  const certs = await fetch(jwks_uri);
  const jwks = await certs.json() as { keys: { kid: string }[] };

  const [headerEncoded, payloadEncoded, signatureEncoded] = id_token.split('.');
  const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString()) as { kid: string };
  const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString());
  logger.debug('payload.header', { payload, header });
  const verify = crypto.createVerify('rsa-sha256');
  verify.update(headerEncoded + '.' + payloadEncoded);

  const publicKey = crypto.createPublicKey({
    format: 'jwk',
    key: jwks.keys.filter(k => k.kid == header.kid)[0],
  });

  const isValidSignature = verify.verify(publicKey, signatureEncoded, 'base64');
  if (!isValidSignature)
    return null;

  if (payload.iss != issuer || payload.aud != audience)
    return null;

  return payload;
}
