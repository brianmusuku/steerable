<script lang="ts">
	import {
		AudioWaveform as AudioWaveformIcon,
		Blocks as BlocksIcon,
		Calendar as CalendarIcon,
		Command as CommandIcon,
		House as HouseIcon,
		Inbox as InboxIcon,
		MessageCircleQuestion as MessageCircleQuestionIcon,
		Search as SearchIcon,
		Settings2 as Settings2Icon,
		Sparkles as SparklesIcon,
		Trash2 as Trash2Icon
	} from '@lucide/svelte';

	import NavFavorites from './nav-favorites.svelte';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import type { ComponentProps } from 'svelte';

	// This is sample data.
	const data = {
		teams: [
			{
				name: 'Acme Inc',
				logo: CommandIcon,
				plan: 'Enterprise'
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveformIcon,
				plan: 'Startup'
			},
			{
				name: 'Evil Corp.',
				logo: CommandIcon,
				plan: 'Free'
			}
		],
		navMain: [
			{
				title: 'Search',
				url: '#',
				icon: SearchIcon
			},
			{
				title: 'Ask AI',
				url: '#',
				icon: SparklesIcon
			}
		],
		navSecondary: [
			{
				title: 'Calendar',
				url: '#',
				icon: CalendarIcon
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2Icon
			},
			{
				title: 'Templates',
				url: '#',
				icon: BlocksIcon
			},
			{
				title: 'Trash',
				url: '#',
				icon: Trash2Icon
			},
			{
				title: 'Help',
				url: '#',
				icon: MessageCircleQuestionIcon
			}
		],
		favorites: [
			{
				name: 'Project Management & Task Tracking',
				url: '#'
			},
			{
				name: 'Family Recipe Collection & Meal Planning',
				url: '#'
			},
			{
				name: 'Fitness Tracker & Workout Routines',
				url: '#'
			},
			{
				name: 'Book Notes & Reading List',
				url: '#'
			},
			{
				name: 'Sustainable Gardening Tips & Plant Care',
				url: '#'
			},
			{
				name: 'Language Learning Progress & Resources',
				url: '#'
			},
			{
				name: 'Home Renovation Ideas & Budget Tracker',
				url: '#'
			},
			{
				name: 'Personal Finance & Investment Portfolio',
				url: '#'
			},
			{
				name: 'Movie & TV Show Watchlist with Reviews',
				url: '#'
			},
			{
				name: 'Daily Habit Tracker & Goal Setting',
				url: '#'
			}
		]
	};

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root class="border-e-0" {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
		<NavMain items={data.navMain} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavFavorites favorites={data.favorites} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
