const crypto = globalThis.crypto;

export const hashCodeChallenge = async (code_verifier: string) => {
    const hashBuf = await crypto.subtle.digest('SHA-256', Buffer.from(code_verifier));
    return Buffer.from(hashBuf).toString('base64url');
};

export const getDiscoveryDocument = async (openid_configuration_endpoint: string) => {
    const res = await fetch(openid_configuration_endpoint);
    const discoveryDoc = (await res.json()) as {
        authorization_endpoint: string;
        token_endpoint: string;
        userinfo_endpoint: string;
        issuer: string;
        jwks_uri: string;
    };
    return discoveryDoc;
};
