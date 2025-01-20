import { UserBooks } from '$lib/types/book';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	// Only logged in users can access these pages
	if (!locals.user) {
		redirect(301, '/register');
	} else if (!locals.user.emailVerification) {
		// If the user is logged in but itìs email isn't verified yet, redirect to login page
		redirect(301, '/login');
	}

	// check if the user has books
	let userBooks: UserBooks;
	if (locals.userBooks && locals.userBooks.userId === locals.user.$id) {
		userBooks = locals.userBooks;
	} else {
		userBooks = new UserBooks(locals.user.$id);
	}

	return {
		user: locals.user,
		userBooks: userBooks.toJSON()
	};
}
