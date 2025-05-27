import { PRIVATE_EXTERNAL_BOOKS_API_KEY } from '$env/static/private';
import {
	PUBLIC_EXTERNAL_BOOKS_API_MAX_RESULTS,
	PUBLIC_EXTERNAL_BOOKS_API_URL
} from '$env/static/public';
import { BookSearch } from '$lib/types/book';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }): Promise<Response> => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { query } = params;

	try {
		const books: BookSearch[] = [];
		try {
			// search the books
			await fetch(
				`${PUBLIC_EXTERNAL_BOOKS_API_URL}?q=${query}&maxResults=${PUBLIC_EXTERNAL_BOOKS_API_MAX_RESULTS}&key=${PRIVATE_EXTERNAL_BOOKS_API_KEY}`
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
		// TODO: handle error properly
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return new Response('Error searching Books', { status: 500 });
		}

		return new Response(JSON.stringify(books), { status: 200 });
	// TODO: handle error properly
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return new Response('Error updating Book', { status: 500 });
	}
};
