// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { IUser } from "$lib/user";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			redirect_url: string,
			oauth: {
				authority: string,
				client_id: string,
				claims: {
					sub: string;
					picture: string;
					email: string;
					email_verified: boolean;
				},
			},
			user: IUser
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
