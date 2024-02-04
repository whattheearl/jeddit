// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			oauth: {
				authority: string,
				client_id: string,
				redirect_url: string,
				claims: {
					sub: string;
					picture: string;
					email: string;
					email_verified: boolean;
				},
			},
			user: User
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
