<script lang="ts">
	import { BookFull } from '$lib/types/book';
	import BookDetails from './BookDetails.svelte';
	import { userState } from '$lib/state/state.svelte';

	// get the userId and the book from the userState
	let { bookId }: { bookId: string } = $props();
	let bookFull: BookFull = $state(new BookFull());
	if (userState.userBooks) {
		bookFull = userState.userBooks.books.find((b) => b.id === bookId) ?? new BookFull();
	}
</script>

<div class="flex w-56 max-w-56 flex-col">
	<BookDetails book={bookFull} displayMode="home" />
</div>
