<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { BookSearch as BookSearchClass } from '$lib/types/book.js';
	import BookSearch from '$lib/components/book/BookSearch.svelte';

	let { data } = $props();
	let searchStr = $state(data.searchStr);

	let isLoading = $state(false);

	// transform searched books to BookSearch
	let books = $state(data.books.map((book) => BookSearchClass.fromJSON(book)));

	async function handleSubmition(event: Event) {
		event.preventDefault();

		isLoading = true;

		data.searchStr = searchStr;

		// Update the URL of the page
		const url = new URL(window.location.href);
		url.searchParams.set('q', searchStr);
		history.pushState({}, '', url); // Push the new URL without reloading the page

		// TODO: Add error handling
		const res = await fetch(`/api/search/books/${searchStr}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const searchResult = await res.json();
		books.splice(0, books.length);
		books = searchResult.map((book: any) => BookSearchClass.fromJSON(book));

		isLoading = false;
	}
</script>

<div class="flex flex-col items-center justify-start pr-8">
	<div class="fixed z-10 h-16 w-full bg-background"></div>
	<div class="fixed z-20 bg-background">
		<form
			method="post"
			onsubmit={handleSubmition}
			class="flex w-[550px] items-center justify-center rounded-lg border-2 border-primary p-1"
		>
			<Input
				id="searchStr"
				name="searchStr"
				type="search"
				bind:value={searchStr}
				placeholder="Search..."
				class="text-md h-12 border-none pl-3 font-semibold"
			/>
			<Button type="submit" class="h-12"
				>{#if isLoading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{/if}Search</Button
			>
		</form>
	</div>

	<span class="h-32"></span>

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
