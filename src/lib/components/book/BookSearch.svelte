<script lang="ts">
	import { BookFull, type BookSearch } from '$lib/types/book';
	import BookDetails from './BookDetails.svelte';
	import { userState } from '$lib/state/state.svelte';

	const { book } = $props<{ book: BookSearch }>();

	// check if the book is already saved
	// if it is, get the bookFull from the state
	// if it is not, create a new BookFull
	let bookFull: BookFull = $state(BookFull.fromBookSearch(book));
	if (userState.userBooks) {
		bookFull =
			userState.userBooks.books.find((b) => b.bookId === book.id) ?? BookFull.fromBookSearch(book);
	}
</script>

<BookDetails book={bookFull} displayMode="search" />
