<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import BookDetails from '$lib/components/book/BookDetails.svelte';
	import { userState } from '$lib/state/state.svelte';
</script>

<div class="ml-1 pr-36">
	<div class="mb-4 w-full bg-background">
		<h1 class="text-3xl font-semibold text-primary">Books</h1>
		<Separator class="mt-2 h-[0.18rem] bg-primary pr-8" />
	</div>

	<ScrollArea>
		<div class="flex h-[80vh] w-full flex-wrap">
			{#if userState.userBooks && userState.userBooks.books.length > 0}
				{#each userState.userBooks.books as book}
					<div class="my-4 ml-1 mr-14 flex">
						<div class="flex w-56 max-w-56 flex-col">
							<BookDetails {book} displayMode="home" />
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-center text-lg text-muted-foreground">No books found</p>
			{/if}
		</div>
	</ScrollArea>
</div>
