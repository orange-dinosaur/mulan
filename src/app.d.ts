import type { Models } from 'node-appwrite';
import type { UserBooks } from '$lib/types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Models.User<Models.Preferences> | undefined;
			userBooks: UserBooks | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
