import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Database } from "bun:sqlite";

export const load: PageServerLoad = async ({ url }) => {
  const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
  const { token_endpoint, userinfo_endpoint, issuer } = await res.json();

  const code = url.searchParams.get('code');
  if (!code)
    error(400, 'searchParam [code] missing');

  const endpoint = new URL(token_endpoint);
  endpoint.searchParams.append('code', code);
  endpoint.searchParams.append('client_id', env.google_client_id);
  endpoint.searchParams.append('client_secret', env.google_client_secret);
  endpoint.searchParams.append('redirect_uri', env.google_redirect_url);
  endpoint.searchParams.append('grant_type', 'authorization_code');
  let response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  if (response.status != 200)
    error(400, response.statusText);

  const { access_token, id_token } = await response.json();
  const headers = new Headers({});
  headers.append('Authorization', `Bearer ${access_token}`)
  response = await fetch(userinfo_endpoint, { headers });
  const userinfo = await response.json();

  console.log(userinfo)
  return {}
}
