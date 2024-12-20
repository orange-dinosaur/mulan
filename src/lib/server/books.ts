import { PUBLIC_BACKEND_API_URL } from '$env/static/public';
import { BookFull, UserBooks } from '$lib/types/book';

export async function getUserBooks(userID: string) {
	const books: BookFull[] = [];

	await fetch(`${PUBLIC_BACKEND_API_URL}/books/${userID}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			// check that the user of the books is the same as the user ID
			if (data.data.userId !== userID) {
				return;
			} else {
				if (data.data.books && data.data.books.length > 0) {
					data.data.books.forEach((b: object) => {
						const book = new BookFull(b);
						books.push(book);
					});
				}
			}
		});

	const userBooks = new UserBooks(userID, { books });

	return userBooks;
}
