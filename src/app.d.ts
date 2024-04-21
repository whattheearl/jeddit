// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { IUser } from '$lib/db/users';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
