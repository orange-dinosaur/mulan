import type { Cookies, RequestHandler } from '@sveltejs/kit';
import {
	createAdminClient,
	createSessionClientCookies,
	SESSION_COOKIE
} from '$lib/server/appwrite';
import { PUBLIC_EMAIL_VERIFICATION_PATH } from '$env/static/public';
import type { AppwriteException } from 'node-appwrite';

export const POST: RequestHandler = async ({ request, cookies }): Promise<Response> => {
	// get the email from the request body
	const { email, password } = await request.json();
	if (!email || !password) {
		return new Response('Email and Password are mandatory fields', { status: 500 });
	}

	if (await checkSession(cookies)) {
		// If the user already has a valid session, send verification email
		await createVerification(cookies);

		return new Response('Verification email Succcessfully sent', { status: 200 });
	}

	// If the user does not have a valid session, create a new one and send verification email
	const { code, message } = await createSession(email, password, cookies);
	if (code !== 200) {
		return new Response(message, { status: code });
	}
	await createVerification(cookies);

	return new Response('Verification email Succcessfully sent', { status: 200 });
};

async function checkSession(cookies: Cookies): Promise<boolean> {
	// Create the Appwrite client
	const { account } = createSessionClientCookies(cookies);

	try {
		await account.get();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}

	return true;
}
async function createSession(
	email: string,
	password: string,
	cookies: Cookies
): Promise<{ code: number; message: string }> {
	const { account } = createAdminClient();

	let session;
	try {
		// Create the session using the client
		session = await account.createEmailPasswordSession(email, password);

		// Set the session cookie with the secret
		cookies.set(SESSION_COOKIE, session.secret, {
			sameSite: 'strict',
			expires: new Date(session.expire),
			secure: true,
			path: '/'
		});

		return {
			code: 200,
			message: ''
		};
	} catch (error) {
		const { code, message } = error as AppwriteException;

		return {
			code: code ?? 500,
			message: message ?? 'Error sending verification email'
		};
	}
}

async function createVerification(cookies: Cookies) {
	// Create the Appwrite client.
	const { account } = createSessionClientCookies(cookies);

	await account.createVerification(PUBLIC_EMAIL_VERIFICATION_PATH);
}
