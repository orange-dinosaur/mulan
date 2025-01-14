<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import * as Alert from '$lib/components/ui/alert/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { CircleAlert, LoaderCircle } from 'lucide-svelte';

	const { form } = $props();

	let isLoading = $state(false);
	let isWaitingAuthentication = $state(false);
</script>

<div class="flex h-screen w-screen items-center">
	<img src={PUBLIC_LANDING_IMAGE} alt="register" class="h-screen w-2/5 rounded-l-[50px] bg-cover" />

	<div class="flex h-full w-full flex-col px-48">
		<div class="flex w-full items-center justify-end py-12">
			<Button href="/login" variant="ghost" class="text-lg font-bold text-primary">Login</Button>
		</div>

		<div class="flex items-center justify-start pb-28 pt-24">
			<a href="/"><img src={logo} alt="logo" class="h-[100px] w-auto" /></a>
		</div>

		<!-- Form -->
		<form
			method="post"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;

					if (result.status === 200) {
						isWaitingAuthentication = true;
						update();
					} else {
						await applyAction(result);
					}

					update();
				};
			}}
			class="flex w-4/5 flex-col"
		>
			{#if isWaitingAuthentication}
				<p class="mb-2 text-lg text-foreground">
					Account created successfully, check your email to complete verification
				</p>
				<p class="mb-3 text-base text-foreground">
					If you didn't receive any email try to login and follow the instructions to receive
					another verification email
				</p>
			{:else}
				<!-- Form Fields -->
				<div class="grid gap-2">
					<div class="grid gap-1">
						<Label class="sr-only" for="username">Username</Label>
						<Input
							id="username"
							name="username"
							type="text"
							value={form?.fields.username ?? ''}
							placeholder="username"
							autocapitalize="none"
							autocomplete="username"
							autocorrect="off"
							disabled={isLoading}
							class="bg-transparent outline-none focus:border-b-2 focus:border-b-primary"
						/>
					</div>
					<div class="grid gap-1">
						<Label class="sr-only" for="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							value={form?.fields.email ?? ''}
							placeholder="name@example.com"
							autocapitalize="none"
							autocomplete="email"
							autocorrect="off"
							disabled={isLoading}
							class="bg-transparent outline-none focus:border-b-2 focus:border-b-primary"
						/>
					</div>
					<div class="grid gap-1">
						<Label class="sr-only" for="password">Pasword</Label>
						<Input
							id="password"
							name="password"
							type="password"
							value={form?.fields.password ?? ''}
							placeholder="*************"
							autocapitalize="none"
							autocorrect="off"
							disabled={isLoading}
							class="bg-transparent text-lg outline-none focus:border-b-2 focus:border-b-primary"
						/>
					</div>

					<!-- Submit button -->
					<Button type="submit" class="my-8 w-48 font-bold"
						>{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Register
					</Button>
				</div>
			{/if}

			<!-- Error alert -->
			{#if form && form?.status != 200}
				<Alert.Root variant="destructive" class="w-3/5">
					<CircleAlert class="mr-2 h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>
						{form?.message ?? 'Error while registering'}
					</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
	</div>
</div>
