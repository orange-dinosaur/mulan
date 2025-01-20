import { createSessionClientCookies, SESSION_COOKIE } from '$lib/server/appwrite';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }): Promise<Response> => {
	const { account } = createSessionClientCookies(cookies);

	// Delete the session on Appwrite, and delete the session cookie.
	await account.deleteSession('current');
	cookies.delete(SESSION_COOKIE, { path: '/' });

	return new Response('Logout successful');
};
