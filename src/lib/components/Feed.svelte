<script lang="ts">
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
		category: string;
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
			category: 'movement'
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
			category: 'timing'
		},
		{
			title: 'Under Utilised Research',
			content: 'Researched kataparuto (550 wood, 300 gold) but made 1 trebuchet.',
			avatar: 'research',
			category: 'research'
		},
		{
			title: 'eAPM Gap',
			content: 'Winner has 30 more eAPM in castle age.',
			avatar: 'eapm',
			category: 'timing'
		},
		{
			title: 'Late Imperial',
			content: 'Looser arrived in imperial age 6 minutes after winner.',
			avatar: 'uptime',
			category: 'timing'
		},
		{
			title: 'Late Research',
			content: 'Double bit axe, available in castle age was researched in imperial age.',
			avatar: 'research',
			category: 'research'
		}
	]);
</script>

<div class="no-scrollbar flex h-screen flex-col gap-4 overflow-y-scroll">
	<div class="flex items-center gap-2">
		<ButtonGroup.Root>
			<Button class="cursor-pointer" variant="outline">Eco</Button>
			<Button class="cursor-pointer" variant="outline">Military</Button>
			<Button class="cursor-pointer" variant="outline">Research</Button>
			<Button class="cursor-pointer" variant="outline">Buildings</Button>
			<Button class="cursor-pointer" variant="outline">Placement</Button>
			<Button class="cursor-pointer" variant="outline">Movement</Button>
		</ButtonGroup.Root>
	</div>
	<div class="flex flex-col">
		{#each posts as post}
			{@const Icon = iconMap[post.avatar]}
			<div
				class="flex border-x p-4 first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b even:border-y"
			>
				<div class="flex items-center gap-2">
					<Icon class="stroke-[2px]" />

					<div class="flex flex-col">
						<h3 class="text-base font-semibold">{post.title}</h3>
						<p class="text-sm text-muted-foreground">{post.content}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
