import { oauthHandler } from "$lib/auth";
import { localSessionHandler } from "$lib/session";
import { sequence } from "@sveltejs/kit/hooks";

export const handle = sequence(
    oauthHandler,
    localSessionHandler,
);

