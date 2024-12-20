import { createSessionClientEvent } from '$lib/server/appwrite';
import { getUserBooks } from '$lib/server/books';

export async function handle({ event, resolve }) {
	// Try to get the current user from the Auth service
	try {
		// Use helper function to create the Appwrite client
		const { account } = createSessionClientEvent(event);
		// Store the current logged in user in locals,
		// for easy access in other routes
		event.locals.user = await account.get();
	} catch {
		/* empty */
	}

	// Try to get the user's books from the database
	if (event.locals.user) {
		try {
			const userBooks = await getUserBooks(event.locals.user.$id);
			// Store the books of the current logged in user in locals,
			// for easy access in other routes
			event.locals.userBooks = userBooks;
		} catch {
			/* empty */
		}
	}

	// Continue with the request.
	return resolve(event);
}
