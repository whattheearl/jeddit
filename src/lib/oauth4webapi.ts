import * as oauth from 'oauth4webapi';
import { env } from '$env/dynamic/private';

const issuer = new URL(env.oauth_authority)
const as = await oauth
    .discoveryRequest(issuer)
    .then((response) => oauth.processDiscoveryResponse(issuer, response))

const client: oauth.Client = {
    client_id: env.oauth_client_id,
    client_secret: env.oauth_client_secret,
    token_endpoint_auth_method: 'client_secret_basic',
}

const redirect_uri = env.oauth_redirect_url;

export async function getAuthorizationUrl() {
    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
        // This example assumes S256 PKCE support is signalled
        // If it isn't supported, random `nonce` must be used for CSRF protection.
        throw new Error()
    }

    const code_verifier = oauth.generateRandomCodeVerifier()
    const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
    const code_challenge_method = 'S256'

    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', client.client_id)
    authorizationUrl.searchParams.set('code_challenge', code_challenge)
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)
    authorizationUrl.searchParams.set('redirect_uri', redirect_uri)
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid email');
    return {
        authorizationUrl,
        code_verifier,
    }
}

export async function getUserInfo(currentUrl: URL, code_verifier: string) {
    let sub: string
    let access_token: string
    {
        const params = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState)
        if (oauth.isOAuth2Error(params)) {
            console.error('error', params)
            throw new Error() // Handle OAuth 2.0 redirect error
        }

        const response = await oauth.authorizationCodeGrantRequest(
            as,
            client,
            params,
            redirect_uri,
            code_verifier,
        )

        let challenges: oauth.WWWAuthenticateChallenge[] | undefined
        if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
            for (const challenge of challenges) {
                console.error('challenge', challenge)
            }
            throw new Error() // Handle www-authenticate challenges as needed
        }

        const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response)
        if (oauth.isOAuth2Error(result)) {
            console.error('error', result)
            throw new Error() // Handle OAuth 2.0 response body error
        }

        console.log('result', result)
            ; ({ access_token } = result)
        const claims = oauth.getValidatedIdTokenClaims(result)
        console.log('ID Token Claims', claims)
            ; ({ sub } = claims)
    }

    // fetch userinfo response
    let result;
    {
        const response = await oauth.userInfoRequest(as, client, access_token)

        let challenges: oauth.WWWAuthenticateChallenge[] | undefined
        if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
            for (const challenge of challenges) {
                console.log('challenge', challenge)
            }
            throw new Error() // Handle www-authenticate challenges as needed
        }

        result = await oauth.processUserInfoResponse(as, client, sub, response)
        return result;
    }
}

