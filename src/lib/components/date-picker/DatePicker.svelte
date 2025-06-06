<script lang="ts">
	import { CalendarIcon } from 'lucide-svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let {
		date,
		onDateChange
	}: { date: DateValue | undefined; onDateChange: (v: DateValue) => void } = $props();

	const df = new DateFormatter('it-IT', {
		dateStyle: 'short'
	});

	let value = $state<DateValue | undefined>(
		date?.compare(new CalendarDate(1970, 1, 1)) === 0 ||
			date?.compare(new CalendarDate(1899, 12, 31)) === 0
			? undefined
			: date
	);
	let contentRef = $state<HTMLElement | null>(null);

	function handleDateChange(date: DateValue) {
		(onDateChange as (date: DateValue) => void)(date);
	}

	/* $effect(() => {
		if (value) {
			handleDateChange(value);
		}
	}); */
</script>

<div class="flex items-center gap-2">
	<Popover.Root>
		<Popover.Trigger
			class={cn(
				buttonVariants({
					variant: 'outline',
					class:
						'm-0 flex h-6 w-36 justify-start rounded-none border-0 border-b-[1px] border-b-primary p-0 text-sm font-normal text-primary'
				}),
				!value && 'text-muted-foreground'
			)}
		>
			<CalendarIcon />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Popover.Trigger>
		<Popover.Content bind:ref={contentRef} class="w-auto p-0 text-primary">
			<Calendar
				type="single"
				bind:value
				maxValue={today(getLocalTimeZone())}
				onValueChange={() => {
					if (value) {
						handleDateChange(value);
					}
				}}
			/>
		</Popover.Content>
	</Popover.Root>

	{#if value}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="cursor-pointer rounded-md text-sm font-semibold text-primary hover:bg-primary/10"
			onclick={() => {
				value = undefined;
				handleDateChange(new CalendarDate(0, 0, 0));
			}}
		>
			x
		</div>
	{/if}
</div>
