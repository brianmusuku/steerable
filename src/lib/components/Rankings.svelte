<script lang="ts">
	import * as Table from '$lib/components/ui/table/';
	import * as ButtonGroup from '$lib/components/ui/button-group/';
	import { Button } from '$lib/components/ui/button/';
	import * as Select from '$lib/components/ui/select/';

	const ratedGames = [
		{
			rank: 1,
			caster: 'T90Official',
			Civs: 'Franks vs Incas',
			Players: 'Hera vs Viper',
			Elo: [2400, 2400],
			Map: 'Arabia',
			Rating: 9.5,
			Date: '2026-01-22 12:00:00',
			GameTime: '52:34',
			TwitchLink: 'https://www.twitch.tv/t90official',
			YoutubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			Notes: 'Good game with a few close calls. '
		},
		{
			rank: 2,
			caster: 'MembTV',
			Civs: 'Britons vs Ethiopians',
			Players: 'Liereyy vs Mr_Yo',
			Elo: [2400, 2400],
			Map: 'Arabia',
			Rating: 9.2,
			Date: '2026-01-21 15:30:00',
			GameTime: '45:12',
			TwitchLink: 'https://www.twitch.tv/membtv',
			YoutubeLink: 'https://www.youtube.com/watch?v=example2',
			Notes: 'Insane archer micro from both sides.'
		},
		{
			rank: 3,
			caster: 'T90Official',
			Civs: 'Spanish vs Berbers',
			Players: 'Tatoh vs Daut',
			Elo: [2400, 2400],
			Map: 'Arena',
			Rating: 8.8,
			Date: '2026-01-20 18:45:00',
			GameTime: '1:05:20',
			TwitchLink: 'https://www.twitch.tv/t90official',
			YoutubeLink: 'https://www.youtube.com/watch?v=example3',
			Notes: 'Classic Arena slugfest with castle drops.'
		},
		{
			rank: 4,
			caster: 'Dave_AoE',
			Civs: 'Mongols vs Mayans',
			Players: 'Nicov vs Villese',
			Elo: [2400, 2400],
			Map: 'Nomad',
			Rating: 9.0,
			Date: '2026-01-19 20:00:00',
			GameTime: '38:15',
			TwitchLink: 'https://www.twitch.tv/dave_aoe',
			YoutubeLink: 'https://www.youtube.com/watch?v=example4',
			Notes: 'Early aggression changed the tide.'
		},
		{
			rank: 5,
			caster: 'Ornlu',
			Civs: 'Teutons vs Poles',
			Players: 'Jordan vs Capoch',
			Elo: [2400, 2400],
			Map: 'Golden Swamp',
			Rating: 8.5,
			Date: '2026-01-18 10:15:00',
			GameTime: '42:55',
			TwitchLink: 'https://www.twitch.tv/ornlu',
			YoutubeLink: 'https://www.youtube.com/watch?v=example5',
			Notes: 'Great utilization of the water control.'
		},
		{
			rank: 6,
			caster: 'Nili_AoE',
			Civs: 'Malians vs Portuguese',
			Players: 'ACCM vs Sitaux',
			Elo: [2400, 2400],
			Map: 'Four Lakes',
			Rating: 8.7,
			Date: '2026-01-17 14:20:00',
			GameTime: '55:10',
			TwitchLink: 'https://www.twitch.tv/nili_aoe',
			YoutubeLink: 'https://www.youtube.com/watch?v=example6',
			Notes: 'Very tactical game with multiple fronts.'
		},
		{
			rank: 7,
			caster: 'T90Official',
			Civs: 'Huns vs Goths',
			Players: 'Hera vs Liereyy',
			Elo: [2400, 2400],
			Map: 'Arabia',
			Rating: 9.4,
			Date: '2026-01-16 16:40:00',
			GameTime: '32:18',
			TwitchLink: 'https://www.twitch.tv/t90official',
			YoutubeLink: 'https://www.youtube.com/watch?v=example7',
			Notes: 'High tempo game with constant raiding.'
		},
		{
			rank: 8,
			caster: 'MembTV',
			Civs: 'Vikings vs Japanese',
			Players: 'Viper vs MBL',
			Elo: [2400, 2400],
			Map: 'Islands',
			Rating: 8.9,
			Date: '2026-01-15 11:55:00',
			GameTime: '1:12:05',
			TwitchLink: 'https://www.twitch.tv/membtv',
			YoutubeLink: 'https://www.youtube.com/watch?v=example8',
			Notes: 'Masterclass in naval positioning.'
		},
		{
			rank: 9,
			caster: 'Dave_AoE',
			Civs: 'Aztecs vs Gurjaras',
			Players: 'TaToH vs Yo',
			Elo: [2400, 2400],
			Map: 'Quarry',
			Rating: 9.1,
			Date: '2026-01-14 19:10:00',
			GameTime: '48:30',
			TwitchLink: 'https://www.twitch.tv/dave_aoe',
			YoutubeLink: 'https://www.youtube.com/watch?v=example9',
			Notes: 'Unique unit compositions made it interesting.'
		},
		{
			rank: 10,
			caster: 'T90Official',
			Civs: 'Byzantines vs Turks',
			Players: 'Daut vs Viper',
			Elo: [2400, 2400],
			Map: 'Arena',
			Rating: 8.6,
			Date: '2026-01-13 13:00:00',
			GameTime: '59:45',
			TwitchLink: 'https://www.twitch.tv/t90official',
			YoutubeLink: 'https://www.youtube.com/watch?v=example10',
			Notes: 'Daut prime performance on Arena.'
		}
	];

	const getTimeElapsed = (date: string) => {
		const now = new Date();
		const past = new Date(date);
		const diff = now.getTime() - past.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days < 1) {
			const hours = Math.floor(diff / (1000 * 60 * 60));
			return `${hours} hours ago`;
		}
		if (days < 7) {
			return `${days} days ago`;
		}
		if (days < 30) {
			return `${Math.floor(days / 7)} weeks ago`;
		}
		if (days < 365) {
			return `${Math.floor(days / 30)} months ago`;
		}
		return `${Math.floor(days / 365)} years ago`;
	};

	const timeRanges = [
		{ label: 'Today', value: 'today' },
		{ label: 'Yesterday', value: 'yesterday' },
		{ label: 'This Week', value: 'this_week' },
		{ label: 'This Month', value: 'this_month' },
		{ label: 'This Year', value: 'this_year' }
	];
	let selectedTimeRange = $state('today');

	const fruits = [
		{ value: 'elo', label: 'By Elo' },
		{ value: 'date', label: 'By Date' },
		{ value: 'rating', label: 'By Rating' },
		{ value: 'game_time', label: 'By Game Time' },
		{ value: 'caster', label: 'By Caster (A - Z)' }
	];

	let value = $state('');

	const triggerContent = $derived(fruits.find((f) => f.value === value)?.label ?? 'Order By');
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex w-full items-center justify-between">
		<ButtonGroup.Root>
			{#each timeRanges as timeRange}
				<Button
					onclick={() => (selectedTimeRange = timeRange.value)}
					class="cursor-pointer "
					variant={selectedTimeRange === timeRange.value ? 'default' : 'outline'}
					size="sm">{timeRange.label}</Button
				>
			{/each}
		</ButtonGroup.Root>

		<Select.Root type="single" name="favoriteFruit" bind:value>
			<Select.Trigger class="w-48 text-foreground">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Fruits</Select.Label>
					{#each fruits as fruit (fruit.value)}
						<Select.Item
							value={fruit.value}
							label={fruit.label}
							disabled={fruit.value === 'grapes'}
						>
							{fruit.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<Table.Root>
		<Table.Caption>Age of Empires II – Recorded Casts Ranking</Table.Caption>

		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[80px]">Rating</Table.Head>
				<Table.Head>Caster</Table.Head>
				<Table.Head>Civs</Table.Head>
				<Table.Head>Players</Table.Head>
				<Table.Head>Map</Table.Head>
				<Table.Head>Date</Table.Head>
				<Table.Head>GameTime</Table.Head>
				<Table.Head>TwitchLink</Table.Head>
				<Table.Head>YoutubeLink</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each ratedGames as game (game.rank)}
				<Table.Row>
					<Table.Cell class="font-medium">{game.Rating}</Table.Cell>
					<Table.Cell class="font-medium">{game.caster}</Table.Cell>
					<Table.Cell class="font-medium">{game.Civs}</Table.Cell>
					<Table.Cell class="font-medium">{game.Players}</Table.Cell>
					<Table.Cell class="font-medium">{game.Map}</Table.Cell>
					<Table.Cell class="font-medium">{getTimeElapsed(game.Date)}</Table.Cell>
					<Table.Cell class="font-medium">{game.GameTime}</Table.Cell>
					<Table.Cell class="font-medium"
						><a target="_blank" class="underline" rel="noopener noreferrer" href={game.TwitchLink}
							>Twitch</a
						></Table.Cell
					>
					<Table.Cell class="font-medium"
						><a target="_blank" class="underline" rel="noopener noreferrer" href={game.YoutubeLink}
							>Youtube</a
						></Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>

		<Table.Footer>
			<Table.Row>
				<Table.Cell colspan={2}>Total Rated Games</Table.Cell>
				<Table.Cell class="text-end">{ratedGames.length}</Table.Cell>
				<Table.Cell colspan={2}></Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
</div>
