import { oauthHandler } from "$lib/auth/oauth-handler";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(oauthHandler);

