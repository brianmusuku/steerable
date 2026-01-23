<script lang="ts" module>
	import {
		AudioWaveform,
		BookOpen,
		Bot,
		Command,
		Settings2,
		SquareTerminal,
		Waypoints
	} from '@lucide/svelte';
	// This is sample data.
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		teams: [
			{
				name: 'Steerable Rankings',
				logo: Waypoints,
				plan: 'Casted Matches'
			},
			{
				name: 'Steerable Auto Cast',
				logo: AudioWaveform,
				plan: 'AOE2 Auto Casts'
			},
			{
				name: 'Steerable Gameplay',
				logo: Command,
				plan: 'Advanced Playing Bots'
			}
		],
		navMain: [
			{
				title: 'Civilisations',
				url: '#',
				icon: SquareTerminal,
				isActive: true,
				items: [
					{
						title: 'All',
						url: '#'
					},
					{
						title: 'Aztecs',
						url: '#'
					},
					{
						title: 'Berbers',
						url: '#'
					}
				]
			},
			{
				title: 'Casters',
				url: '#',
				icon: Bot,
				items: [
					{
						title: 'All',
						url: '#'
					},
					{
						title: 'T90',
						url: '#'
					},
					{
						title: 'Memb',
						url: '#'
					}
				]
			},
			{
				title: 'Platform',
				url: '#',
				icon: BookOpen,
				items: [
					{
						title: 'All',
						url: '#'
					},
					{
						title: 'Twitch',
						url: '#'
					},
					{
						title: 'YouTube',
						url: '#'
					}
				]
			},
			{
				title: 'Map',
				url: '#',
				icon: Settings2,
				items: [
					{
						title: 'All',
						url: '#'
					},
					{
						title: 'Open',
						url: '#'
					},
					{
						title: 'Closed',
						url: '#'
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import TeamSwitcher from '$lib/components/team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import type { ComponentProps } from 'svelte';
	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
