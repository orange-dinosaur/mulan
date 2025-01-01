<script>
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
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

		<form class="flex w-4/5 flex-col">
			<div class="grid gap-2">
				<div class="grid gap-1">
					<Label class="sr-only" for="email">Email</Label>
					<Input
						id="username"
						name="username"
						type="text"
						placeholder="username"
						autocapitalize="none"
						autocomplete="username"
						autocorrect="off"
						class="bg-transparent outline-none focus:border-b-2 focus:border-b-primary"
					/>
				</div>
				<div class="grid gap-1">
					<Label class="sr-only" for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="name@example.com"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
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
						autocapitalize="none"
						autocorrect="off"
						class="bg-transparent text-lg outline-none focus:border-b-2 focus:border-b-primary"
					/>
				</div>
				<Button type="submit" class="my-8 w-48 font-bold">Register</Button>
			</div>
		</form>
	</div>
</div>
