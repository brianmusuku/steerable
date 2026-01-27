<script lang="ts">
	import { User, ChessKnight, Swords, ChartNoAxesCombined } from '@lucide/svelte';

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

<div class="no-scrollbar flex h-screen w-200 flex-col overflow-y-scroll">
	{#each posts as post}
		{@const Icon = iconMap[post.avatar]}
		<div class="flex border-x p-4 first:border-t last:border-b even:border-y">
			<div class="flex items-center gap-2">
				<Icon class="size-8 stroke-[2px]" />

				<div class="flex flex-col">
					<h3 class="text-lg font-semibold">{post.title}</h3>
					<p class="text-muted-foreground">{post.content}</p>
				</div>
			</div>
		</div>
	{/each}
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
