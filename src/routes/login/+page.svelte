<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import * as Alert from '$lib/components/ui/alert/index';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { userState } from '$lib/state/state.svelte.js';
	import { error } from '@sveltejs/kit';
	import { LoaderCircle, CircleAlert } from 'lucide-svelte';

	const { form } = $props();

	let isLoading = $state(false);
	let errorWhileSendingVerificationEmail = $state(false);
	let errorMessageWhileSendingVerificationEmail = $state('');
	let newVerificationEmailSent = $state(false);

	async function sendVerificationEmail(email: String, password: String) {
		const res = await fetch('/api/send-verification', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (res.ok) {
			errorWhileSendingVerificationEmail = false;
			errorMessageWhileSendingVerificationEmail = '';
			newVerificationEmailSent = true;
		} else {
			errorWhileSendingVerificationEmail = true;
			errorMessageWhileSendingVerificationEmail = await res.text();
			newVerificationEmailSent = false;
		}
	}
</script>

<div class="flex h-screen w-screen items-center">
	<img src={PUBLIC_LANDING_IMAGE} alt="login" class="h-screen w-2/5 rounded-l-[50px] bg-cover" />

	<div class="flex h-full w-full flex-col px-48">
		<div class="flex w-full items-center justify-end py-12">
			<Button href="/register" variant="ghost" class="text-lg font-bold text-primary"
				>Register</Button
			>
		</div>

		<div class="flex items-center justify-start pb-28 pt-24">
			<a href="/"><img src={logo} alt="logo" class="h-[100px] w-auto" /></a>
		</div>

		<!-- Form -->
		<form
			class="flex w-4/5 flex-col"
			method="post"
			action="?/login"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;

					if (result.status === 200) {
						update();

						// clean userState after login
						userState.clean();
					} else {
						await applyAction(result);
					}

					update();
				};
			}}
		>
			<!-- Form fields -->
			<div class="grid gap-2">
				{#if form && form.status === 401 && form.message === 'User not verified'}
					{#if newVerificationEmailSent}
						<p class="mb-2 text-lg text-foreground">Verification email sent to your address</p>
						<p class="mb-3 text-base text-foreground">
							If you didn't receive any email click the button below to try again
						</p>
					{:else}
						<p class="mb-2 text-lg text-foreground">Your email has yet to be verified</p>
						<p class="mb-3 text-base text-foreground">
							Click the button below to receive a new verification link
						</p>
					{/if}

					<Button
						class="my-8 w-48 font-bold"
						onclick={() => sendVerificationEmail(form.fields.email, form.fields.password)}
					>
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Verification email
					</Button>
				{:else}
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
					<div class="grid gap-1">
						<Label class="sr-only" for="password">Pasword</Label>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="*************"
							value={form?.fields.password ?? ''}
							autocapitalize="none"
							autocorrect="off"
							disabled={isLoading}
							class="bg-transparent outline-none focus:border-b-2 focus:border-b-primary"
						/>
					</div>

					<a href="/recover-password" class="mb-4 ml-2 mt-2 text-xs text-blue-800 hover:underline"
						>Forgot your password?</a
					>

					<!-- Submit button -->
					<Button type="submit" class="mb-8 w-48 font-bold">
						{#if isLoading}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Login
					</Button>
				{/if}
			</div>
		</form>

		<!-- Error alert -->
		{#if (form && form.status != 200 && form.message != 'User not verified') || errorWhileSendingVerificationEmail}
			<Alert.Root variant="destructive" class="w-3/5">
				<CircleAlert class="mr-2 h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>
					{errorWhileSendingVerificationEmail
						? (errorMessageWhileSendingVerificationEmail ??
							'Error while sending verification email')
						: (form?.message ?? 'Error while loggin in')}
				</Alert.Description>
			</Alert.Root>
		{/if}
	</div>
</div>
