<script lang="ts">
	import NavMain from '$lib/components/app-sidebar/nav-main.svelte';
	import NavUser from '$lib/components/app-sidebar/nav-user.svelte';
	import AppLogo from '$lib/components/app-sidebar/app-logo.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let {
		appLogo,
		navMain,
		navUser
	}: {
		appLogo: {
			name: string;
			logo: any;
			url: string;
		};
		navMain: {
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
		}[];
		navUser: {
			username: string;
			email: string;
			avatar: string;
		};
	} = $props();
</script>

<Sidebar.Root collapsible="icon">
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
