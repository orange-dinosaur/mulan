import { PUBLIC_AVATAR_BASE_URL, PUBLIC_EMAIL_VERIFICATION_PATH } from '$env/static/public';
import {
	createAdminClient,
	createSessionClientCookies,
	SESSION_COOKIE
} from '$lib/server/appwrite';
import { fail, redirect, type Cookies } from '@sveltejs/kit';
import { ID, type AppwriteException } from 'node-appwrite';

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
	default: async ({ request, cookies }) => {
		// Extract the form data.
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const username = formData.get('username')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		// Create the Appwrite client.
		const { account } = createAdminClient();

		let session;
		try {
			// Create the session using the client
			await account.create(ID.unique(), email, password, username);
			session = await account.createEmailPasswordSession(email, password);

			// Set the session cookie with the secret
			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/'
			});

			await updateSinglePreference(cookies, 'avatar', `${PUBLIC_AVATAR_BASE_URL}${session.userId}`);

			await createVerification(cookies);
		} catch (error) {
			const { code, message } = error as AppwriteException;

			return fail(code ?? 500, {
				status: code,
				message,
				fields: {
					email,
					username,
					password
				}
			});
		}

		return {
			status: 200,
			message: 'User account created successfully',
			fields: {
				email: '',
				username: '',
				password: ''
			}
		};
	}
};

// TODO
async function updateSinglePreference(cookies: Cookies, key: string, value: string) {
	// Create the Appwrite client.
	const { account } = createSessionClientCookies(cookies);

	await account.updatePrefs({ [key]: value });
}

async function createVerification(cookies: Cookies) {
	// Create the Appwrite client.
	const { account } = createSessionClientCookies(cookies);

	await account.createVerification(PUBLIC_EMAIL_VERIFICATION_PATH);
}
