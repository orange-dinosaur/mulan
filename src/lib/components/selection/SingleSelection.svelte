<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		possibleSelections,
		selection,
		onSelectionChange
	}: { possibleSelections: string[]; selection: string; onSelectionChange: (v: string) => void } =
		$props();

	function handleSelectionChange(selection: string) {
		(onSelectionChange as (selection: string) => void)(selection);
	}
</script>

<Select.Root
	type="single"
	name="single-selection"
	bind:value={selection}
	onValueChange={handleSelectionChange}
>
	<Select.Trigger
		class="m-0 h-6 w-[180px] rounded-none border-0 border-b-[1px] border-b-primary p-0 py-1 text-sm"
	>
		{#if selection}
			<span class="text-primary">{selection}</span>
		{:else}
			<span class="text-muted-foreground">Select an option</span>
		{/if}
	</Select.Trigger>
	<Select.Content>
		{#each possibleSelections as possibleSelection}
			<Select.Item value={possibleSelection}>{possibleSelection}</Select.Item>
		{/each}
		<Select.Item value=""></Select.Item>
	</Select.Content>
</Select.Root>
