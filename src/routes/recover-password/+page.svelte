<script>
	import { applyAction, enhance } from '$app/forms';
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { LoaderCircle } from 'lucide-svelte';

	const { form } = $props();

	let isLoading = $state(false);
	let recoveryAlreadySent = $state(false);
</script>

<div class="flex h-screen w-screen items-center">
	<img src={PUBLIC_LANDING_IMAGE} alt="login" class="h-screen w-2/5 rounded-l-[50px] bg-cover" />

	<div class="flex h-full w-full flex-col px-48">
		<div class="flex w-full items-center justify-end py-12">
			<Button href="/login" variant="ghost" class="mr-2 text-lg font-bold text-primary"
				>Login</Button
			>
			<Button href="/register" variant="ghost" class="text-lg font-bold text-primary"
				>Register</Button
			>
		</div>

		<div class="flex items-center justify-start pb-28 pt-24">
			<a href="/"><img src={logo} alt="logo" class="h-[100px] w-auto" /></a>
		</div>

		<!-- Form - Email to recover password -->
		<form
			class="flex w-4/5 flex-col"
			method="post"
			action="?/send_recovery_link"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					if (result.status === 200) {
						update();
					} else {
						await applyAction(result);
					}

					update();
					isLoading = false;
					recoveryAlreadySent = true;
				};
			}}
		>
			<div class="grid gap-2">
				{#if recoveryAlreadySent}
					<p class="mb-2 text-lg text-foreground">
						An email have been sent to recover your password
					</p>
					<p class="mb-3 text-base text-foreground">
						If you didn't receive the email, click the button below to send it again
					</p>

					<Button class="my-8 w-48 font-bold" onclick={() => (recoveryAlreadySent = false)}>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Send Again
					</Button>
				{:else}
					<p class="mb-4 text-lg text-foreground">Insert your email to receive a recovery link</p>

					<!-- Form fields -->
					<div class="grid gap-1">
						<Label class="sr-only" for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="name@example.com"
							value={form?.fields.email ?? ''}
							autocapitalize="none"
							autocomplete="email"
							autocorrect="off"
							disabled={isLoading}
							class="bg-transparent outline-none focus:border-b-2 focus:border-b-primary"
						/>
					</div>

					<!-- Submit button -->
					<Button type="submit" class="my-8 w-48 font-bold">
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Recover password
					</Button>
				{/if}
			</div>
		</form>
	</div>
</div>
