<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import {
		User,
		ChessKnight,
		Swords,
		ChartNoAxesCombined,
		Building2,
		Building,
		Landmark,
		BowArrow,
		FlaskConical,
		Clock,
		Keyboard
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/';
	import { cubicOut } from 'svelte/easing';

	const iconMap = {
		villager: User,
		eco: ChartNoAxesCombined,
		calvary: ChessKnight,
		soldier: Swords,
		building: Landmark,
		archer: BowArrow,
		research: FlaskConical,
		uptime: Clock,
		eapm: Keyboard
	};

	interface Data {
		title: string;
		content: string;
		avatar: keyof typeof iconMap;
		category: 'military' | 'buildings' | 'research' | 'APM' | 'map control';
	}

	let posts = $state<Data[]>([
		{
			title: 'Civ Utilization',
			content: '10 percent of military was Calvary 90% was archers, this is a cav civilization.',
			avatar: 'calvary',
			category: 'military'
		},
		{
			title: 'Building Utilization',
			content: 'Majority (67%) of the skirmishers were produced from 1 range.',
			avatar: 'building',
			category: 'buildings'
		},

		{
			title: 'Army Composition',
			content: 'Archers were severely outnumbered by counter skirmishers in feudal age.',
			avatar: 'archer',
			category: 'military'
		},
		{
			title: 'Expedition',
			content: '16 cavaliers did not move more than 3 tiles in the entire match.',
			avatar: 'calvary',
			category: 'APM'
		},
		{
			title: 'Missed Research',
			content: '50% of the military was archers yet no ballistics research was done.',
			avatar: 'research',
			category: 'research'
		},
		{
			title: 'Late Castle',
			content: 'Castle age came 6 minutes after the opponent.',
			avatar: 'uptime',
			category: 'research'
		},
		{
			title: 'Under Utilised Research',
			content: 'Researched kataparuto (550 wood, 300 gold) but made 1 trebuchet.',
			avatar: 'research',
			category: 'research'
		},
		{
			title: 'Long Garrison',
			content: '4 villagers stayed garrisoned for 2 minutes at 15:56',
			avatar: 'building',
			category: 'APM'
		},
		{
			title: 'eAPM Gap',
			content: 'Winner has 30 more eAPM in castle age.',
			avatar: 'eapm',
			category: 'APM'
		},
		{
			title: 'Late Imperial',
			content: 'Looser arrived in imperial age 6 minutes after winner.',
			avatar: 'uptime',
			category: 'research'
		},
		{
			title: 'Late Research',
			content: 'Double bit axe, available in castle age was researched in imperial age.',
			avatar: 'research',
			category: 'research'
		},
		{
			title: 'APM',
			content:
				'70% of the apm was spent on military APM, while 30% was spent on economy. Opponent spent 60% of apm on economy.',
			avatar: 'eapm',
			category: 'APM'
		},
		{
			title: 'Army map control',
			content: 'In dark age, army spent 90 % of their time in enemy base.',
			avatar: 'soldier',
			category: 'map control'
		},
		{
			title: 'Army map control',
			content: 'In castle age, army spent 90 % of their time in the home base.',
			avatar: 'soldier',
			category: 'map control'
		},
		{
			title: 'Tactical Retreats',
			content: '13 tactical retreats in feudal age.',
			avatar: 'soldier',
			category: 'APM'
		},
		{
			title: 'Army Size',
			content: 'Average army group had 20 members in imperial age.',
			avatar: 'soldier',
			category: 'APM'
		},
		{
			title: 'Lancer Hunt',
			content: 'Lancer hunted 20 villagers at minute 11:00',
			avatar: 'soldier',
			category: 'APM'
		},
		{
			title: 'Delayed Imperial Age',
			content: 'Clicked imperial age at 12:09 and then again at 12:56',
			avatar: 'research',
			category: 'research'
		},
		{
			title: 'Large Value in Queue',
			content: 'Largest value unit queue was 6 trebuchet costing 560 gold, 2 minutes after imp',
			avatar: 'building',
			category: 'military'
		},
		{
			title: 'Large Unit Queue',
			content:
				'Largest unit queue was 13 skirmishers at minute 11:00 costing 650 food, 10 minutes after imp',
			avatar: 'building',
			category: 'military'
		},
		{
			title: 'Long waiting time',
			content:
				'Longest wait time was 2 minutes for an upgrade was 2 minutes after chemistry was cancelled twice.',
			avatar: 'research',
			category: 'research'
		}
	]);

	let activeCategory = $state('all');
	const categories = ['all', 'eco', 'military', 'research', 'buildings', 'map control', 'APM'];
	let filteredPosts = $state(posts);

	const filterPosts = (category: string) => {
		activeCategory = category;

		if (category === 'all') {
			filteredPosts = posts;
		} else {
			filteredPosts = posts.filter((post) => post.category === category);
		}
	};
</script>

<div class=" flex flex-col gap-4">
	<div class="flex items-center gap-2">
		<ButtonGroup.Root>
			{#each categories as category}
				{@const fomartedCategory = category.charAt(0).toUpperCase() + category.slice(1)}
				<Button
					onclick={() => filterPosts(category)}
					class="cursor-pointer"
					variant={activeCategory === category ? 'default' : 'outline'}
				>
					{fomartedCategory}

					<Badge class="size-4.5 rounded-full text-[10px] tabular-nums">
						{#if category === 'all'}
							{posts.length}
						{:else}
							{posts.filter((post) => post.category === category).length}
						{/if}
					</Badge>
				</Button>
			{/each}
		</ButtonGroup.Root>
	</div>
	<div
		class="no-scrollbar flex h-[calc(100vh-13rem)] min-h-[calc(100vh-13rem)] flex-col overflow-y-scroll"
	>
		{#each filteredPosts as post, i (post)}
			<div
				animate:flip={{ duration: 400 }}
				in:fly={{ y: 20, duration: 500, delay: i * 100 }}
				out:fade={{ duration: 300, easing: cubicOut }}
				class="flex border-x p-4 first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b even:border-y"
			>
				{@render postContent(post)}
			</div>
		{/each}
	</div>
</div>

{#snippet postContent(post: Data)}
	{@const Icon = iconMap[post.avatar]}
	<div class="flex items-center gap-2">
		<Icon class="stroke-[2px]" />

		<div class="flex flex-col">
			<h3 class="text-base font-semibold">{post.title}</h3>
			<p class="text-sm text-muted-foreground">{post.content}</p>
		</div>
	</div>
{/snippet}

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
