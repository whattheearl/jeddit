import { Logger } from "$lib/logger";

const logger = Logger("jwt");

export interface VerifyOptions {
  issuer: string;
  audience: string;
}

export interface IClaims {
  iss: string;
  sub: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  nonce: string;
}

interface JWK extends JsonWebKey {
  kid: string;
}

interface JWKS {
  keys: JWK[];
}

export const verifyJwt = async (
  jwks: JWKS,
  token: string,
  options: VerifyOptions,
) => {
  logger.debug("validating token");

  const [headerEncoded, payloadEncoded, signatureEncoded] = token.split(".");
  const header = JSON.parse(
    Buffer.from(headerEncoded, "base64").toString(),
  ) as { kid: string };
  const payload = JSON.parse(
    Buffer.from(payloadEncoded, "base64").toString(),
  ) as any;
  logger.debug("payload.header", { payload, header });

  const jwk = jwks.keys.filter((k: any) => k.kid == header.kid)[0];
  logger.debug("jwk", { jwk });

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      //these are the algorithm options
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false,
    ["verify"],
  );

  logger.debug("now verify", { signatureEncoded, payload });
  const isValidSignature = await crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey, //from generateKey or importKey above
    Buffer.from(signatureEncoded, "base64url"),
    Buffer.from(`${headerEncoded}.${payloadEncoded}`),
  );

  logger.debug(isValidSignature);
  if (!isValidSignature) throw new Error(`invalid signature`);

  if (options.audience && options.audience != payload.aud)
    throw new Error(
      `audience does not match [${options.audience}] [${payload.aud}]`,
    );

  if (options.issuer && options.issuer != payload.iss)
    throw new Error(
      `issuer does not match [${options.issuer}] [${payload.iss}]`,
    );

  const { exp } = payload;
  const now = Math.floor(Date.now() / 1000);
  if (exp - now < 0) throw new Error(`token expired [${exp}] [${now}]`);

  const { iat } = payload;
  if (now - iat < 0) throw new Error(`token not valid yet [${iat}] [${now}]`);

  return payload as IClaims;
};