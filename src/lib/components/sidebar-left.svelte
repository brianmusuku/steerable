<script lang="ts" module>
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import CommandIcon from '@lucide/svelte/icons/command';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import MapIcon from '@lucide/svelte/icons/map';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
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
				logo: GalleryVerticalEndIcon,
				plan: 'Casted Matches'
			},
			{
				name: 'Steerable Auto Cast',
				logo: AudioWaveformIcon,
				plan: 'AOE2 Auto Casts'
			},
			{
				name: 'Steerable Gameplay',
				logo: CommandIcon,
				plan: 'Advanced Playing Bots'
			}
		],
		navMain: [
			{
				title: 'Civilisations',
				url: '#',
				icon: SquareTerminalIcon,
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
				icon: BotIcon,
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
				icon: BookOpenIcon,
				items: [
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
				icon: Settings2Icon,
				items: [
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
