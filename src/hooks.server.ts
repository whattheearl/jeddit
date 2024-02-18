import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authnHandler } from '$lib/handlers/authn';

export const handle: Handle = sequence(authnHandler);
