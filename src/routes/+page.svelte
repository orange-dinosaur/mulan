<script>
	import { PUBLIC_LANDING_IMAGE } from '$env/static/public';
	import logo from '$lib/assets/logo.png';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-screen w-screen items-center">
	<img src={PUBLIC_LANDING_IMAGE} alt="landing" class="h-screen w-2/5 rounded-l-[50px] bg-cover" />

	<div class="flex h-full flex-col px-48">
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

		<h1 class="pb-16 text-6xl font-bold text-primary">Welcome to Tyna</h1>

		<p class="text-xl text-foreground">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere exercitationem quas fugit?
			Omnis reprehenderit, ab, voluptatibus nam delectus quo temporibus numquam esse reiciendis
			suscipit voluptatem debitis accusamus sint fugiat eos?
		</p>
	</div>
</div>
