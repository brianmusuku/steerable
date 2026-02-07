<script>
	export let player = {
		name: 'You',
		winner: true,
		civ: 'FRANKS',
		stats: { apm: 142, pop: 120 }
	};
</script>

<div class="player-card" class:is-winner={player.winner}>
	<span class="label">{player.name} {player.winner ? '(Winner)' : ''}</span>
	<div class="civ-badge uppercase">{player.civ}</div>
	<div class="stat-grid">
		<div>
			<span class="label">APM</span>
			<span class="value">{player.stats.apm}</span>
		</div>
		<div>
			<span class="label">Pop</span>
			<span class="value">{player.stats.pop}</span>
		</div>
	</div>
</div>

<style>
	.player-card {
		margin-bottom: 24px;
		position: relative;
	}

	.player-card::before {
		content: '';
		position: absolute;
		left: -24px;
		top: 4px;
		width: 4px;
		height: 100%;
		background: var(--grid-line);
	}

	.player-card.is-winner::before {
		background: var(--success-green, #2d8659);
	}

	.civ-badge {
		display: inline-block;
		border: 1px solid var(--text-dark);
		color: var(--text-dark);
		padding: 2px 6px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 14px;
		margin-top: 4px;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-top: 16px;
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
</style>
