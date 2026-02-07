<script>
	/** @type {{
		time: string;
		type: string;
		text: string;
		icon?: typeof import('@lucide/svelte').Icon;
		action?: { label: string; href: string };
		metrics: {
			label: string;
			you: { value: string | number; percentage: number; color?: string };
			opponent: { value: string | number; percentage: number };
		}
	}} */
	export let insight = {
		time: '00:00',
		type: 'General',
		text: '',
		icon: undefined,
		/** @type {{ label: string; href: string } | undefined} */
		action: undefined,
		metrics: {
			label: '',
			you: {
				value: '',
				percentage: 0,
				/** @type {string | undefined} */
				color: undefined
			},
			opponent: { value: '', percentage: 0 }
		}
	};
</script>

<article class="insight-item">
	<div class="insight-time">
		{#if insight.icon}
			<insight.icon />
		{:else}
			<span>{insight.time}</span>
		{/if}
	</div>
	<div class="insight-content">
		<div class="insight-type">{insight.type}</div>
		<p class="insight-text">
			{@html insight.text.replaceAll('\n', '<br>')}
		</p>
		{#if insight.action && insight.action.label}
			<div class="actions">
				<a href={insight.action.href} class="btn-action">{insight.action.label} -&gt;</a>
			</div>
		{/if}
	</div>
	<div class="insight-metrics">
		<span class="label">{insight.metrics.label}</span>
		<div class="bar-chart">
			<div class="bar-row">
				<span class="bar-label">YOU</span>
				<div class="bar-track">
					<div
						class="bar-fill"
						style="width: {insight.metrics.you.percentage}%; background: {insight.metrics.you
							.color || 'var(--text-dark)'};"
					></div>
				</div>
				<span class="bar-value">{insight.metrics.you.value}</span>
			</div>
			<div class="bar-row">
				<span class="bar-label">OPP</span>
				<div class="bar-track">
					<div
						class="bar-fill opponent"
						style="width: {insight.metrics.opponent.percentage}%;"
					></div>
				</div>
				<span class="bar-value">{insight.metrics.opponent.value}</span>
			</div>
		</div>
	</div>
</article>

<style>
	.insight-item {
		display: grid;
		grid-template-columns: 120px 1fr 200px;
		border-bottom: var(--border-width) solid var(--grid-line);
		transition: background 0.2s;
	}

	.insight-item:last-child {
		border-bottom: none;
	}

	.insight-item:hover {
		background: rgba(0, 0, 0, 0.02);
	}

	.insight-time {
		padding: 24px;
		border-right: var(--border-width) solid var(--grid-line);
		font-family: var(--font-display);
		font-size: 18px;
		color: var(--text-dark);
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.insight-content {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.insight-type {
		font-size: 10px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-dim);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.insight-type::before {
		content: '';
		display: block;
		width: 8px;
		height: 8px;
		background: var(--text-dim);
	}

	.insight-text {
		font-size: 14px;
		color: var(--text-dark);
	}

	.insight-metrics {
		padding: 24px;
		border-left: var(--border-width) solid var(--grid-line);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
	}

	.bar-chart {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 10px;
	}

	.bar-label {
		width: 30px;
		color: var(--text-dim);
	}

	.bar-track {
		flex-grow: 1;
		height: 6px;
		background: rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.bar-fill {
		height: 100%;
		background: var(--text-dark);
	}

	.bar-fill.opponent {
		background: var(--text-dim);
	}

	.bar-value {
		width: 30px;
		text-align: right;
		font-weight: 700;
	}

	.actions {
		padding: 16px 0;
		display: flex;
		gap: 16px;
		margin-top: 8px;
	}

	.btn-action {
		font-family: var(--font-display);
		text-transform: uppercase;
		font-weight: 700;
		font-size: 14px;
		color: var(--success-green, #63dfa1);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.btn-action:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
	}

	.label {
		font-size: 10px;
		text-transform: uppercase;
		color: var(--text-dim);
		letter-spacing: 0.05em;
		margin-bottom: 4px;
		display: block;
	}

	@media (max-width: 900px) {
		.insight-item {
			grid-template-columns: 80px 1fr;
		}
		.insight-metrics {
			grid-column: span 2;
			border-left: none;
			border-top: var(--border-width) solid var(--grid-line);
		}
	}
</style>
