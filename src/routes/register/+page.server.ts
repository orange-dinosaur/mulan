import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user && locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, `/users/${locals.user.$id}`);
	}
}
