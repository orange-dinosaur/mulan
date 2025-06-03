<script lang="ts">
	import { CalendarIcon } from 'lucide-svelte';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let {
		date,
		onDateChange
	}: { date: DateValue | undefined; onDateChange: (v: DateValue) => void } = $props();

	const df = new DateFormatter('it-IT', {
		dateStyle: 'short'
	});

	let value = $state<DateValue | undefined>(date ? date : undefined);
	let contentRef = $state<HTMLElement | null>(null);

	function handleDateChange(date: DateValue) {
		(onDateChange as (date: DateValue) => void)(date);
	}
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class:
					'm-0 flex h-6 w-[180px] justify-start rounded-none border-0 border-b-[1px] border-b-primary p-0 text-sm font-normal text-primary'
			}),
			!value && 'text-muted-foreground'
		)}
		onchange={(e) => {
			const customEvent = e as unknown as CustomEvent<{ value: DateValue }>;
			value = customEvent.detail.value;
			handleDateChange(value);
		}}
	>
		<CalendarIcon />
		{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0 text-primary">
		<Calendar type="single" bind:value />
	</Popover.Content>
</Popover.Root>
