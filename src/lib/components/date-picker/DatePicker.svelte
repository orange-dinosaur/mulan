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
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let {
		date,
		onDateChange
	}: { date: DateValue | undefined; onDateChange: (v: DateValue) => void } = $props();

	const df = new DateFormatter('it-IT', {
		dateStyle: 'short'
	});
	const mf = new DateFormatter('en-IT', {
		month: 'long'
	});

	let value = $state<DateValue | undefined>(
		date?.compare(new CalendarDate(1970, 1, 1)) === 0 ||
			date?.compare(new CalendarDate(1899, 12, 31)) === 0
			? undefined
			: date
	);
	let placeholder = $state<DateValue>();
	let contentRef = $state<HTMLElement | null>(null);

	const monthOptions = Array.from({ length: 12 }, (_, i) => {
		const month = today(getLocalTimeZone()).set({ month: i + 1 });
		return {
			value: month.month,
			label: mf.format(month.toDate(getLocalTimeZone()))
		};
	});

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	const defaultYear = $derived(
		placeholder ? { value: placeholder.year, label: String(placeholder.year) } : undefined
	);

	const defaultMonth = $derived(
		placeholder
			? {
					value: placeholder.month,
					label: mf.format(placeholder.toDate(getLocalTimeZone()))
				}
			: undefined
	);

	const monthLabel = $derived(
		monthOptions.find((m) => m.value === defaultMonth?.value)?.label ?? 'Select a month'
	);

	function handleDateChange(date: DateValue) {
		(onDateChange as (date: DateValue) => void)(date);
	}
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
			<!-- <Calendar
				type="single"
				bind:value
				maxValue={today(getLocalTimeZone())}
				onValueChange={() => {
					if (value) {
						handleDateChange(value);
					}
				}}
			/> -->

			<CalendarPrimitive.Root
				type="single"
				weekdayFormat="short"
				class={cn('rounded-md border p-3')}
				bind:value
				bind:placeholder
				weekStartsOn={1}
				maxValue={today(getLocalTimeZone())}
				onValueChange={() => {
					if (value) {
						handleDateChange(value);
					}
				}}
			>
				{#snippet children({ months, weekdays })}
					<Calendar.Header class="flex w-full items-center justify-between gap-2">
						<Select.Root
							type="single"
							value={`${defaultMonth?.value}`}
							onValueChange={(v) => {
								if (!placeholder) return;
								if (v === `${placeholder.month}`) return;
								placeholder = placeholder.set({ month: Number.parseInt(v) });
							}}
						>
							<Select.Trigger aria-label="Select month" class="w-[60%]">
								{monthLabel}
							</Select.Trigger>
							<Select.Content class="max-h-[200px] overflow-y-auto">
								{#each monthOptions as { value, label } (value)}
									<Select.Item value={`${value}`} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
						<Select.Root
							type="single"
							value={`${defaultYear?.value}`}
							onValueChange={(v) => {
								if (!v || !placeholder) return;
								if (v === `${placeholder?.year}`) return;
								placeholder = placeholder.set({ year: Number.parseInt(v) });
							}}
						>
							<Select.Trigger aria-label="Select year" class="w-[40%]">
								{defaultYear?.label ?? 'Select year'}
							</Select.Trigger>
							<Select.Content class="max-h-[200px] overflow-y-auto">
								{#each yearOptions as { value, label } (value)}
									<Select.Item value={`${value}`} {label} />
								{/each}
							</Select.Content>
						</Select.Root>
					</Calendar.Header>
					<Calendar.Months>
						{#each months as month (month)}
							<Calendar.Grid>
								<Calendar.GridHead>
									<Calendar.GridRow class="flex">
										{#each weekdays as weekday (weekday)}
											<Calendar.HeadCell>
												{weekday.slice(0, 2)}
											</Calendar.HeadCell>
										{/each}
									</Calendar.GridRow>
								</Calendar.GridHead>
								<Calendar.GridBody>
									{#each month.weeks as weekDates (weekDates)}
										<Calendar.GridRow class="mt-2 w-full">
											{#each weekDates as date (date)}
												<Calendar.Cell class="select-none" {date} month={month.value}>
													<Calendar.Day />
												</Calendar.Cell>
											{/each}
										</Calendar.GridRow>
									{/each}
								</Calendar.GridBody>
							</Calendar.Grid>
						{/each}
					</Calendar.Months>
				{/snippet}
			</CalendarPrimitive.Root>
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
				placeholder = undefined;
			}}
		>
			x
		</div>
	{/if}
</div>
