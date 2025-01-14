<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle } from 'lucide-svelte';

	const { data } = $props();

	let isLoading = $state(false);
</script>

<div class="flex h-screen w-screen items-center">
	<img src={PUBLIC_LANDING_IMAGE} alt="landing" class="h-screen w-2/5 rounded-l-[50px] bg-cover" />

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

		{#if data.data.status === 200}
			<p class="mb-2 text-lg text-foreground">Your email has been successfully validated</p>
			<p class="mb-3 text-base text-foreground">Click the button below to be redirected to login</p>

			<Button class="my-8 w-48 font-bold" onclick={() => goto('/login')}>Login</Button>
		{:else}
			<!-- TODO: Find a way to add a button to resend the verification email -->
			<p class="mb-2 text-lg text-foreground">There's been a problem validating your email</p>
			<p class="mb-3 text-base text-foreground">
				To receive another verification email try to login and follow the instructions
			</p>
		{/if}
	</div>
</div>
