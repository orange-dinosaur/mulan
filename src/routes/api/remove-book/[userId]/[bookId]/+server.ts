import { PUBLIC_BACKEND_API_URL } from '$env/static/public';
import { type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ params, locals }): Promise<Response> => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	// get the user_id and book_id from the params
	const { userId, bookId } = params;

	// check that the userId of the book to be updated is coherent with the current logged in user's id
	if (userId !== locals.user.$id) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const res = await fetch(`${PUBLIC_BACKEND_API_URL}/books/${userId}/${bookId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			return new Response('Error deleting Book', { status: res.status });
		} else {
			return new Response('Book Succcessfully deleted');
		}
	} catch (error) {
		return new Response('Error deleting Book', { status: 500 });
	}
};
