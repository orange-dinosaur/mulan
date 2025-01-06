import { createClient } from '$lib/server/appwrite';
import { redirect } from '@sveltejs/kit';
import type { AppwriteException } from 'node-appwrite';

export async function load({ locals, url }) {
	if (locals.user && locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, `/users/${locals.user.$id}`);
	}

	const userId = url.searchParams.get('userId')?.toString() ?? '';
	const secret = url.searchParams.get('secret')?.toString() ?? '';

	// Create the Appwrite client.
	const { account } = createClient();

	// verify user account
	try {
		await account.updateVerification(userId, secret);
	} catch (error) {
		const { code, message } = error as AppwriteException;

		return {
			data: {
				status: code,
				message
			}
		};
	}

	return {
		data: {
			status: 200,
			message: 'Email verified successfully!'
		}
	};
}
