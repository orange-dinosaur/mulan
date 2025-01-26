<script lang="ts">
	import type { UserBooks } from '$lib/types/book';
	import type { Models } from 'node-appwrite';
	import { getContext } from 'svelte';

	const user: Models.User<Models.Preferences> = getContext('user');
	const userBooks: UserBooks = getContext('userBooks');
</script>

<div class="flex flex-col">
	<div class="mb-8 flex flex-col">
		<h1>USER: {user.$id}</h1>
		<h1>USERNAME: {user.name}</h1>
		<h1>ENAMIL: {user.email}</h1>
	</div>

	<div class="flex flex-col">
		<h1>USER BOOKS:</h1>
		{#each userBooks.books as book}
			<h1>{book.title}</h1>
		{/each}
	</div>
</div>
