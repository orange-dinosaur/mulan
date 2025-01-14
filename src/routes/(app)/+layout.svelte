<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar/app-sidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { LoaderCircle, Search, WatchIcon } from 'lucide-svelte';

	let { children } = $props();

	let isLoading = $state(false);

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function handleSearchSubmit(event: { preventDefault: () => void }) {
		event.preventDefault(); // Prevent default form submission
		isLoading = true; // Show loading spinner
		/* await goto('/search?q=' + searchString); */ // Navigate to the target page
		await new Promise((resolve) => setTimeout(resolve, 1000));
		isLoading = false; // Hide loading spinner
	}
</script>

<Sidebar.Provider>
	<AppSidebar />

	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<p class="font-bold text-primary">tyna</p>
			</div>

			<!-- Search -->
			<form
				onsubmit={handleSearchSubmit}
				class="flex w-[450px] items-center justify-center rounded-md border-2 border-primary pr-1 text-xs"
			>
				<Input
					id="searchString"
					name="searchString"
					type="search"
					placeholder="search..."
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

		<div class="flex h-full w-full pl-4 pt-0">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
