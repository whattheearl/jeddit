import { oauthHandler } from "$lib/handlers/oauth.handler";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(oauthHandler);

