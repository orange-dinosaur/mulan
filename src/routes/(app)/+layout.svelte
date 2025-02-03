<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_AVATAR_BASE_URL } from '$env/static/public';
	import AppSidebar from '$lib/components/app-sidebar/app-sidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { userState } from '$lib/state/state.svelte.js';
	import { UserBooks } from '$lib/types/book.js';
	import { LoaderCircle, Search, Home, Book, Bookmark, Star, Award, Turtle } from 'lucide-svelte';
	import { setContext } from 'svelte';

	let { children, data } = $props();
	const { user, userBooks } = data;

	// TODO: make sure that the user object is not null, so that we can access the pages without errors
	let avatarUrl = PUBLIC_AVATAR_BASE_URL + 'mulan';
	if (user?.prefs && 'avatar' in user?.prefs) {
		avatarUrl = user.prefs.avatar?.toString() ?? PUBLIC_AVATAR_BASE_URL + 'mulan';
	}

	// set context for child components with the user info
	setContext('user', user);

	// create and set state with the user books and the search string
	userState.userBooks = UserBooks.fromJSON(userBooks);

	// Sidebar data
	let restProps = {
		appLogo: { name: 'tyna', logo: Turtle, url: `/users/${user?.$id}` },
		navMain: [
			{
				title: 'Home',
				url: `/users/${user?.$id}`,
				icon: Home,
				isActive: true
			},
			{
				title: 'Books',
				url: `/users/${user?.$id}/books`,
				icon: Book
			},
			{
				title: 'Bookmarks',
				url: `/users/${user?.$id}/bookmarks`,
				icon: Bookmark
			},
			{
				title: 'Favorites',
				url: `/users/${user?.$id}/favorites`,
				icon: Star
			},
			{
				title: 'Awards',
				url: `/users/${user?.$id}/awards`,
				icon: Award
			}
		],
		navUser: {
			username: user?.name ?? '',
			email: user?.email ?? '',
			avatar: avatarUrl
		}
	};

	let isLoading = $state(false);
	let searchString = $state(userState.searchString);

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleSearchSubmit(event: { preventDefault: () => void }) {
		event.preventDefault(); // Prevent default form submission
		isLoading = true; // Show loading spinner
		await goto('/search?q=' + searchString); // Navigate to the target page
		isLoading = false; // Hide loading spinner
	}
</script>

<Sidebar.Provider>
	<AppSidebar {...restProps} />

	<Sidebar.Inset class="flex min-h-screen flex-col">
		<header
			class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<!-- <Separator orientation="vertical" class="mr-2 h-4" />
				<p class="font-bold text-primary">tyna</p> -->
			</div>

			<!-- Search -->
			<form
				onsubmit={handleSearchSubmit}
				class="mr-20 flex w-[450px] items-center justify-center rounded-md border-2 border-primary pr-1 text-xs"
			>
				<Input
					id="searchString"
					name="searchString"
					type="search"
					placeholder="search..."
					bind:value={searchString}
					onchange={() => (userState.searchString = searchString)}
					class="font- m-0 mr-2 h-5 border-none p-0 pl-2 text-xs"
				/>
				<Button type="submit" variant="ghost" class="m-0 h-6 min-h-6 w-6 min-w-6 rounded-full p-0">
					{#if isLoading}
						<LoaderCircle class="h-4 w-4 animate-spin" />
					{:else}
						<Search strokeWidth={3} class="h-2 w-2 font-bold text-primary" />
					{/if}
				</Button>
			</form>
		</header>

		<ScrollArea class="h-[calc(100vh-5rem)]">
			<div class="flex w-full pl-4 pt-0">
				{@render children()}
			</div>
		</ScrollArea>
	</Sidebar.Inset>
</Sidebar.Provider>
