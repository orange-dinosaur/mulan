import { createAdminClient } from '$lib/server/appwrite.js';
import { fail, redirect } from '@sveltejs/kit';
import type { AppwriteException } from 'node-appwrite';

export async function load({ locals }) {
	if (locals.user && locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, `/users/${locals.user.$id}`);
	}
}

export const actions = {
	update_password: async ({ request, url }) => {
		// get the userId and secret from the url
		const userId = url.searchParams.get('userId')?.toString() ?? '';
		const secret = url.searchParams.get('secret')?.toString() ?? '';

		// Extract the form data.
		const formData = await request.formData();
		const password = formData.get('password')?.toString() ?? '';

		// Create the Appwrite client.
		const { account } = createAdminClient();

		try {
			await account.updateRecovery(userId, secret, password);
		} catch (error) {
			const { code, message } = error as AppwriteException;

			return fail(code ?? 500, {
				status: 'Password recovery failed, please try again',
				message,
				fields: {
					password
				}
			});
		}

		return {
			status: 200,
			message: 'Password updated successfully!',
			fields: {
				password: ''
			}
		};
	}
};
