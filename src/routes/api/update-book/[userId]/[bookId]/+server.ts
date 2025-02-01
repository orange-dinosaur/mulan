import { PUBLIC_BACKEND_API_URL } from '$env/static/public';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request, locals }): Promise<Response> => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	// get the user_id and book_id from the params
	const { userId, bookId } = params;

	// get the fields to update from the request body
	const bookToUpdate = await request.json();

	// check that the userId of the book to be updated is coherent with the current logged in user's id
	if (userId !== locals.user.$id) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const res = await fetch(`${PUBLIC_BACKEND_API_URL}/books/${userId}/${bookId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookToUpdate)
		});

		if (!res.ok) {
			return new Response('Error updating Book', { status: res.status });
		} else {
			return new Response('Book Succcessfully updated');
		}
	} catch (error) {
		return new Response('Error updating Book', { status: 500 });
	}
};
