import { PUBLIC_BACKEND_API_URL } from '$env/static/public';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }): Promise<Response> => {
	if (!locals.user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const bookToSave = await request.json();

	try {
		const res = await fetch(`${PUBLIC_BACKEND_API_URL}/books`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookToSave)
		});

		if (!res.ok) {
			return new Response('Error updating Book', { status: res.status });
		} else {
			const resJSON = await res.json();
			const resJSONData = resJSON.data;

			return new Response(JSON.stringify(resJSONData), {
				status: res.status
			});
		}
	} catch (error) {
		return new Response('Error updating Book', { status: 500 });
	}
};
