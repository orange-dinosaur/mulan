import { PUBLIC_PASSWORD_RECOVERY_PATH } from '$env/static/public';
import { createAdminClient } from '$lib/server/appwrite.js';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user && locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, `/users/${locals.user.$id}`);
	}
}

export const actions = {
	send_recovery_link: async ({ request }) => {
		// Extract the form data.
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';

		// Create the Appwrite client.
		const { account } = createAdminClient();
		try {
			await account.createRecovery(email, PUBLIC_PASSWORD_RECOVERY_PATH);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			// TODO: Handle error
		}

		return {
			status: 200,
			message: 'Password recovery email sent',
			fields: {
				email,
				password: ''
			}
		};
	}
};
