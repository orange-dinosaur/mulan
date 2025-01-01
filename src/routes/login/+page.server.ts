import {
	createAdminClient,
	createSessionClientCookies,
	SESSION_COOKIE
} from '$lib/server/appwrite.js';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import type { AppwriteException } from 'node-appwrite';

export async function load({ locals }) {
	if (locals.user && locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, `/users/${locals.user.$id}`);
	}
}

export const actions = {
	// Action to create a new user account and session
	// A user can successully login only if the email is verified
	// Even if the email is not verified the session is still created,
	// so that after the user verifies the email, they can be redirected to their account page
	login: async ({ request, cookies }) => {
		// Extract the form data.
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		// Create the Appwrite client.
		const { account } = createAdminClient();

		let session;
		try {
			session = await account.createEmailPasswordSession(email, password);
		} catch (error) {
			const { code, message } = error as AppwriteException;

			return fail(code ?? 500, {
				status: code,
				message,
				fields: {
					email,
					password
				}
			});
		}

		// Set the session cookie with the secret
		cookies.set(SESSION_COOKIE, session.secret, {
			sameSite: 'strict',
			expires: new Date(session.expire),
			secure: true,
			path: '/'
		});

		// check if the user is verified
		const userIsVerified = await checkVerification(cookies);

		if (!userIsVerified) {
			return fail(401, {
				status: 401,
				message: 'User is not verified. Please verify your email address.',
				fields: {
					email,
					password
				}
			});
		}

		// Redirect to the account page.
		redirect(301, `/users/${session.userId}`);
	}
};

async function checkVerification(cookies: Cookies) {
	// Create the Appwrite client.
	const { account } = createSessionClientCookies(cookies);

	let userAccount;
	try {
		userAccount = await account.get();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}

	return userAccount.emailVerification;
}
