import { PRIVATE_EXTERNAL_BOOKS_API_KEY } from '$env/static/private';
import {
	PUBLIC_EXTERNAL_BOOKS_API_MAX_RESULTS,
	PUBLIC_EXTERNAL_BOOKS_API_URL
} from '$env/static/public';
import { BookSearch } from '$lib/types/book';
import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	// Logged out users can't access this page.
	if (!locals.user) {
		redirect(301, '/register');
	} else if (!locals.user.emailVerification) {
		// If the user is logged in and is email is verified, redirect to its home page.
		redirect(301, '/login');
	}

	// get the search params from the URL
	let searchStr = '';
	if (url.searchParams.has('q')) {
		// get the searchStr
		searchStr = url.searchParams.get('q') ?? '';
	}

	// search the books
	const books: BookSearch[] = [];
	if (searchStr != '') {
		try {
			// search the books
			await fetch(
				`${PUBLIC_EXTERNAL_BOOKS_API_URL}?q=${searchStr}&maxResults=${PUBLIC_EXTERNAL_BOOKS_API_MAX_RESULTS}&key=${PRIVATE_EXTERNAL_BOOKS_API_KEY}`
			)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					const items = data.items;

					// loop through the items
					items.forEach((item: object) => {
						const book = new BookSearch(item);

						books.push(book);
					});
				});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			// TODO: handle the error
		}
	}

	const plainObjectBooks = books.map((book) => book.toJSON());

	return {
		searchStr,
		books: plainObjectBooks
	};
}
