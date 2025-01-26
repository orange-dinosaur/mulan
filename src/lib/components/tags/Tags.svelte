<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Tags } from 'lucide-svelte';

	let { tags, onTagsChange } = $props();

	let tagsArr: string[] = $state(tags as string[]);
	let tag = $state('');
	let isAddingTag = $state(false);

	function handleTagsChange(tags: string[]) {
		(onTagsChange as (tags: string[]) => void)(tags);
	}
</script>

<div class="flex flex-wrap items-center">
	<Tags size={24} class="text-primary mr-2" />

	{#each tagsArr as tag}
		<Badge class="mr-2 rounded-md py-1"
			>{tag} |
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore event_directive_deprecated -->
			<div
				class="ml-2 cursor-pointer"
				onclick={() => {
					tagsArr = tagsArr.filter((t) => t !== tag);
					handleTagsChange(tagsArr);
				}}
			>
				x
			</div></Badge
		>
	{/each}

	{#if !isAddingTag}
		<Button
			variant="ghost"
			class="h-4 w-4 text-xs text-primary font-semibold rounded-full"
			on:click={() => (isAddingTag = true)}>+</Button
		>
	{:else}
		<div class="flex items-center">
			<input
				id="tag"
				name="tag"
				type="text"
				bind:value={tag}
				placeholder="tag"
				class="w-32 border-b-2 border-primary bg-transparent px-2 mr-2 text-sm"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						tagsArr.push(tag);
						tag = '';
						isAddingTag = false;
						handleTagsChange(tagsArr);
					}
				}}
			/>
			<Button
				variant="default"
				class="h-2 w-2 text-xs rounded-md py-3"
				on:click={() => {
					tagsArr.push(tag);
					tag = '';
					handleTagsChange(tagsArr);
					isAddingTag = false;
				}}>v</Button
			>
			<Button
				variant="destructive"
				class="h-2 w-2 text-xs rounded-md py-3 ml-1"
				on:click={() => {
					tag = '';
					isAddingTag = false;
				}}>x</Button
			>
		</div>
	{/if}
</div>
