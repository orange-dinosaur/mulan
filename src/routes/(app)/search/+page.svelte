<script lang="ts">
	import { BookSearch as BookSearchClass } from '$lib/types/book.js';
	import BookSearch from '$lib/components/book/BookSearch.svelte';

	let { data } = $props();
	let searchStr = $state(data.searchStr);

	let isLoading = $state(false);

	// transform searched books to BookSearch
	let books = $state(data.books.map((book) => BookSearchClass.fromJSON(book)));
</script>

<div class="flex flex-col items-center justify-start pt-16">
	{#if books.length > 0}
		{#each books as book (book.id)}
			<div class="flex w-3/5 py-4">
				<BookSearch {book} />
			</div>
		{/each}
	{:else}
		<p class="mt-32 text-center text-lg text-muted-foreground">No books found</p>
	{/if}
</div>
