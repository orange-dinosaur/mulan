<script lang="ts">
	import { UserBooks } from '$lib/types/book';
	import type { Models } from 'node-appwrite';
	import { getContext } from 'svelte';
	import { userState } from '$lib/state/state.svelte';

	const user: Models.User<Models.Preferences> = getContext('user');
	let userBooks: UserBooks = $state(userState ? userState.userBooks : new UserBooks(user.$id));

	console.log('USERSTATE - BOOKS: ', userState.userBooks);
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
