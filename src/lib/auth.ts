import { Logger } from "./logger";

const logger = Logger('auth');

export const generateCodeVerifier = () => {
  const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(64))).toString('hex');
  return code_verifier;
}

export const hashCodeChallenge = async (code_verifier: string) => {
  const hashBuf = await crypto.subtle.digest('sha256', Buffer.from(code_verifier));
  const code_challenge = Buffer.from(hashBuf).toString('base64url');
  return code_challenge;
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
  logger.debug('generateTokenUrl', endpoint);
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
  logger.info('getClaims');
  const certs = await fetch(jwks_uri);
  const jwks = await certs.json() as any;
  logger.debug('jwks', jwks);

  const [headerEncoded, payloadEncoded, signatureEncoded] = id_token.split('.');
  const header = JSON.parse(Buffer.from(headerEncoded, 'base64').toString()) as { kid: string };
  const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString());
  logger.debug('payload.header', { payload, header });

  const jwk = jwks.keys.filter((k: any) => k.kid == header.kid)[0];
  logger.debug('jwk', JSON.stringify(jwk))

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {   //these are the algorithm options
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false,
    ['verify']
  );
  logger.debug('now verify', { signatureEncoded, payload })
  // const isValidSignature = await crypto.subtle.verify('rsa-sha256', publicKey, Buffer.from(signatureEncoded), Buffer.from(payload));
  const isValidSignature = await crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey, //from generateKey or importKey above
    Buffer.from(signatureEncoded, 'base64url'),
    Buffer.from(`${headerEncoded}.${payloadEncoded}`)
  )
  logger.debug(isValidSignature)
  if (!isValidSignature)
    return null;

  if (payload.iss != issuer || payload.aud != audience)
    return null;

  return payload;
}
