// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			oauth: {
				authority: string,
				iss: string,
				claims: {
					sub: string;
					picture: string;
					email: string;
					email_verified: boolean;
				},
			},
			user: {
				id: string,
				email: string,
			}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
