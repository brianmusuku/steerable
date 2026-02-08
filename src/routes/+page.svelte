<script lang="ts">
	import { onMount } from 'svelte';
	import { genState } from '$lib/genState.svelte';
	import PlayerCard from '$lib/components/PlayerCard.svelte';
	import InsightItem from '$lib/components/InsightItem.svelte';
	import {
		CirclePoundSterling,
		DoorClosedLocked,
		Power,
		Sailboat,
		ShoppingCart,
		Store,
		Timer,
		Tractor
	} from '@lucide/svelte';

	let matchData = $state({
		id: '#8192',
		mapType: 'Arabia (1v1)',
		duration: '34:12',
		players: [
			{
				name: 'You',
				winner: true,
				civ: 'FRANKS',
				stats: { apm: 142, pop: 120 }
			},
			{
				name: 'Opponent',
				winner: false,
				civ: 'MAYANS',
				stats: { apm: 156, pop: 115 }
			}
		],
		insights: [
			{
				time: '04:12',
				icon: CirclePoundSterling,
				type: 'Economy / Resource Allocation',
				text: 'Player 1 spent 65% of resources on eco and 35% on military.\n Player 2 spent 50% on eco and 50% on military.',
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 80 },
					opponent: { value: '5s', percentage: 20 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Garrison Time',
				text: 'Player 1 villagers were garrisoned for 45s during Feudal, 30s during Castle, and 15s during Imperial. \n Player 2 villagers were garrisoned for 10s in dark ages, 5s in feudal, and 2s in castle.',
				icon: DoorClosedLocked,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 70 },
					opponent: { value: '5s', percentage: 30 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / uptime',
				text: 'Player 1 had 10 min idle time and reached castle age at 15:00.\n Player had 40s of idle time and reached castle age at 12:00.',
				icon: Timer,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 20 },
					opponent: { value: '5s', percentage: 80 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Resource Usage',
				text: 'Player 1 spent 3000 food, 1000 wood, 500 gold in castle age.\n Player 2 spent 2000 food, 500 wood, 200 gold in castle age.',
				icon: ShoppingCart,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 30 },
					opponent: { value: '5s', percentage: 70 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Market',
				text: 'Player 1 spent bought 300 resources from the market, sold 100.\n Player 2 bought 100 resources from the market, sold 300.',
				icon: Store,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 60 },
					opponent: { value: '5s', percentage: 40 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Farms',
				text: 'Player 1 made 0 farms in dark age, 10 in feudal, 20 in castle.\n Player 2 made 10 farms in dark age, 20 in feudal, 30 in castle.',
				icon: Tractor,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 60 },
					opponent: { value: '5s', percentage: 40 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Farm APM',
				text: 'Player 1 went from 0 to 20 farms in 2 minutes.\n Player 2 went from 0 to 11 farms in 3 minutes.',
				icon: Tractor,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 80 },
					opponent: { value: '5s', percentage: 10 }
				}
			},
			{
				time: '04:12',
				type: 'Economy / Fishing APM',
				text: 'Player 1 went from 0 to 20 fishing boats in 2 minutes.\n Player 2 went from 0 to 11 fishing boats in 3 minutes.',
				icon: Sailboat,
				metrics: {
					label: 'Idle TC Time',
					you: { value: '45s', percentage: 80 },
					opponent: { value: '5s', percentage: 10 }
				}
			},
			{
				time: '12:30',
				type: 'Military / Upgrades',
				text: 'Engagement taken without Fletching. Opponent had +1 range advantage leading to inefficient trade.',
				metrics: {
					label: 'K/D Ratio this fight',
					you: { value: '0.4', percentage: 90 },
					opponent: { value: '2.1', percentage: 90 }
				}
			},
			{
				time: '18:45',
				type: 'Map Control / Relics',
				text: 'Opponent secured 3 relics uncontested. Monastery built late relative to map control advantage.',
				metrics: {
					label: 'Relic Gold / Min',
					you: { value: '0', percentage: 0 },
					opponent: { value: '90', percentage: 75 }
				}
			},
			{
				time: '24:10',
				type: 'Production / Siege',
				text: 'Missed lethal opportunity. Opponent had no mangonel defense against your forward workshop for 2 minutes.',
				action: { label: 'Analyze Timing', href: '#' },
				metrics: {
					label: 'Siege Unit Count',
					you: { value: '3', percentage: 60 },
					opponent: { value: '0', percentage: 0 }
				}
			}
		]
	});

	onMount(async () => {
		const resp = await fetch('/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: 'Welcome to my website'
			})
		});

		const data = await resp.json();
		matchData.players = data.info.players;
		matchData.id = data.info.id;
		matchData.mapType = data.info.mapType;
		matchData.duration = data.info.duration.split('.')[0];

		console.log(data);
		genState.currentHtml = data.aiResponse;
	});

	let activeFilter = $state('All');
	const filters = ['All', 'Economy', 'Military', 'Research'];

	let filteredInsights = $derived(
		activeFilter === 'All'
			? matchData.insights
			: matchData.insights.filter((i) => i.type.startsWith(activeFilter))
	);
</script>

<svelte:head>
	<title>AOE2 IQ</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Rajdhani:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="layout">
	<aside class="sidebar">
		<div class="header-block">
			<span class="label">Analysis Matrix</span>
			<h1 class="font-bold">Match {matchData.id}</h1>
			<span class="label">Map Type</span>
			<span class="value">{matchData.mapType}</span>
			<span class="label" style="margin-top: 8px;">Duration</span>
			<span class="value">{matchData.duration}</span>
		</div>

		<div class="matchup">
			{#each matchData.players as player}
				<PlayerCard {player} />
			{/each}
		</div>
	</aside>

	<main class="feed-container">
		<div class="feed-header">
			<div>
				<h2 class="font-bold">Tactical Feed</h2>
				<span class="label">Post match analysis (Things to note)</span>
			</div>
			<div class="feed-filter">
				{#each filters as filter}
					<button
						class="filter-btn"
						class:active={activeFilter === filter}
						onclick={() => (activeFilter = filter)}
					>
						{filter}
					</button>
				{/each}
			</div>
		</div>

		<div class="feed-list no-scrollbar h-[calc(100vh-120px)] overflow-y-auto">
			{#each filteredInsights as insight}
				<InsightItem {insight} />
			{/each}
		</div>
	</main>
</div>

<style>
	.no-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	:global(:root) {
		--bg-color: #ffffff;
		--grid-line: #d1d1d1;
		--accent-purple: #1a1a1a;
		--success-green: #2d8659;
		--text-dark: #121212;
		--text-dim: #666666;

		--grid-size: 24px;
		--border-width: 1px;

		--font-display: 'Rajdhani', sans-serif;
		--font-mono: 'JetBrains Mono', monospace;
	}

	:global(body) {
		background-color: var(--bg-color);
		background-size: var(--grid-size) var(--grid-size);
		color: var(--text-dark);
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.5;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		margin: 0;
	}

	.layout {
		width: 100%;
		display: grid;
		grid-template-columns: 340px 1fr;
		border: var(--border-width) solid var(--grid-line);
		background: var(--bg-color);
	}

	h1,
	h2 {
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-dark);
		line-height: 1;
	}

	.label {
		font-size: 10px;
		text-transform: uppercase;
		color: var(--text-dim);
		letter-spacing: 0.05em;
		margin-bottom: 4px;
		display: block;
	}

	.value {
		font-weight: 700;
		color: var(--text-dark);
	}

	.sidebar {
		border-right: var(--border-width) solid var(--grid-line);
		display: flex;
		flex-direction: column;
	}

	.header-block {
		padding: 24px;
		border-bottom: var(--border-width) solid var(--grid-line);
	}

	.header-block h1 {
		font-size: 32px;
		margin-bottom: 8px;
	}

	.matchup {
		padding: 24px;
		flex-grow: 1;
	}

	.feed-container {
		display: flex;
		flex-direction: column;
	}

	.feed-header {
		padding: 24px;
		border-bottom: var(--border-width) solid var(--grid-line);
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.feed-header h2 {
		font-size: 24px;
	}

	.feed-filter {
		display: flex;
		gap: 12px;
	}

	.filter-btn {
		background: transparent;
		border: 1px solid var(--grid-line);
		color: var(--text-dim);
		padding: 4px 12px;
		font-family: var(--font-mono);
		font-size: 11px;
		cursor: pointer;
		text-transform: uppercase;
		transition: all 0.2s;
	}

	.filter-btn:hover,
	.filter-btn.active {
		border-color: var(--text-dark);
		background: var(--text-dark);
		color: white;
	}

	.feed-list {
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 900px) {
		:global(body) {
			padding: 24px;
		}

		.layout {
			grid-template-columns: 1fr;
		}

		.sidebar {
			border-right: none;
			border-bottom: var(--border-width) solid var(--grid-line);
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.header-block {
			border-bottom: none;
			border-right: var(--border-width) solid var(--grid-line);
		}
	}
</style>
