<script lang="ts">
	import NavMain from '$lib/components/app-sidebar/nav-main.svelte';
	import NavUser from '$lib/components/app-sidebar/nav-user.svelte';
	import AppLogo from '$lib/components/app-sidebar/app-logo.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
	console.log('REST PROPS', restProps);

	let appLogo: {
		name: string;
		logo: any;
		url: string;
	} = $state({
		name: '',
		logo: null,
		url: '/'
	});
	let navMain: {
		title: string;
		url: string;
		// this should be `Component` after lucide-svelte updates types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[] = $state([{ title: '', url: '' }]);
	let navUser: {
		username: string;
		email: string;
		avatar: string;
	} = $state({
		username: '',
		email: '',
		avatar: ''
	});
	// check the properties
	if ('appLogo' in restProps) {
		appLogo = restProps.appLogo as { name: string; logo: any; url: string };
	}
	if ('navMain' in restProps) {
		navMain = restProps.navMain as {
			title: string;
			url: string;
			icon?: any;
			isActive?: boolean;
			items?: { title: string; url: string }[];
		}[];
	}
	if ('navUser' in restProps) {
		navUser = restProps.navUser as { username: string; email: string; avatar: string };
	}
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<!-- TODO: substitute icon logo with image -->
		<AppLogo app={{ name: appLogo.name, logo: appLogo.logo, url: appLogo.url }} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={navUser} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
