<script lang="ts">
	import { BookSearch as BookSearchClass, type BookSearchJSON } from '$lib/types/book.js';
	import BookSearch from '$lib/components/book/BookSearch.svelte';
	import { userState } from '$lib/state/state.svelte.js';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	// transform searched books to BookSearch
	const seenIds = new Set<string>(); // To avoid duplicates
	let books = $state(
		data.books
			.filter((book) => {
				if (seenIds.has(book.id)) return false; // Skip if already seen
				seenIds.add(book.id); // Mark this ID as seen
				return true; // Include this book
			})
			.map((book) => BookSearchClass.fromJSON(book))
	);
	let searchStr = $state(userState.searchString);
	if (page.url.pathname.includes('/search')) {
		userState.searchString = page.url.searchParams.get('q') || '';
		searchStr = userState.searchString;
	}

	$effect(() => {
		let searchParams = page.url.searchParams.get('q') || '';

		if (searchParams !== searchStr) {
			userState.searchString = searchParams;
			searchStr = searchParams;

			// Update books based on the new search string
			(async () => {
				const res = await fetch(`/api/search/books/${searchStr}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (!res.ok) {
					toast.error('Error while searching for books, please try again.', {
						duration: 5000
					});
				} else {
					const data: BookSearchJSON[] = await res.json();
					books.length = 0;
					books.push(...data.map((item) => BookSearchClass.fromJSON(item)));
				}
			})();
		}
	});
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
