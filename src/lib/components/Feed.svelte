<script lang="ts">
	import { User, ChessKnight, Swords, ChartNoAxesCombined } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/';

	const iconMap = {
		villager: User,
		eco: ChartNoAxesCombined,
		calvary: ChessKnight,
		drush: Swords
	};

	let posts = $state<{ title: string; content: string; avatar: keyof typeof iconMap }[]>([
		{
			title: 'Villager',
			content: '30 villagers made in feudal age.',
			avatar: 'villager'
		},
		{
			title: 'Villager',
			content: '36 villagers made in castle age.',
			avatar: 'villager'
		},

		{
			title: 'Eco',
			content: '13 farms in Castle Age.',
			avatar: 'eco'
		},
		{
			title: 'Scout Rush',
			content: 'Scout rush at 8:30. 16 scouts sent forward.',
			avatar: 'calvary'
		},
		{
			title: 'Drush',
			content: 'Drush at 8:30. 16 scouts sent forward.',
			avatar: 'drush'
		}
	]);
</script>

<div class="no-scrollbar flex h-screen w-200 flex-col gap-4 overflow-y-scroll">
	<div class="flex items-center gap-2">
		<ButtonGroup.Root>
			<Button class="cursor-pointer" variant="outline">Eco</Button>
			<Button class="cursor-pointer" variant="outline">Military</Button>
			<Button class="cursor-pointer" variant="outline">Research</Button>
			<Button class="cursor-pointer" variant="outline">Buildings</Button>
			<Button class="cursor-pointer" variant="outline">Placement</Button>
		</ButtonGroup.Root>
	</div>
	<div class="flex flex-col">
		{#each posts as post}
			{@const Icon = iconMap[post.avatar]}
			<div class="flex border-x p-4 first:border-t last:border-b even:border-y">
				<div class="flex items-center gap-2">
					<Icon class="stroke-[2px]" />

					<div class="flex flex-col">
						<h3 class="text-lg font-semibold">{post.title}</h3>
						<p class="text-muted-foreground">{post.content}</p>
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
