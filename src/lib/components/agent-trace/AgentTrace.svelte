<script lang="ts">
	import Timeline from './Timeline.svelte';
	import Stage from './Stage.svelte';
	import { narration as staticNarration } from '$lib/data/llm_output2';

	let { narration = staticNarration, id = 'default' } = $props();

	let current: number = $state(-1);
</script>

<div
	class="dark flex h-screen flex-col overflow-hidden border border-agent-border bg-agent font-sans text-agent-default"
>
	<div
		class="flex shrink-0 items-center gap-2.5 border-b border-agent-border bg-agent-surface px-4 py-2.5"
	></div>

	<header class="landing-topbar">
		<div class="landing-brand">STEERABLE</div>
		<div class="landing-path">
			<span class="text-agent-subtle">reasoning traces</span>
			<span class="text-agent-dim">→</span>
			<span class="text-agent">{narration.content.length} steps</span>
		</div>
		<nav class="landing-nav">
			<button class="landing-nav-btn">unlock audio</button>
		</nav>
	</header>

	<div class="flex min-h-0 flex-1">
		<Timeline {current} actions={narration.content} onJump={(i) => (current = i)} />
		<Stage bind:index={current} {narration} {id} />
	</div>
</div>

<style>
	/* ─── Topbar ───────────────────────────────────────────────────── */
	.landing-topbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 200;
		height: 40px;
		background: #0d1117;
		border-bottom: 1px solid #21262d;
		display: flex;
		align-items: center;
		backdrop-filter: blur(12px);
	}

	.landing-brand {
		background: #00d4aa;
		color: #000;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		padding: 0 14px;
		height: 100%;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.landing-path {
		font-size: 11px;
		padding: 0 16px;
		letter-spacing: 0.04em;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.landing-nav {
		margin-left: auto;
		display: flex;
		align-items: center;
		height: 100%;
		padding-right: 8px;
	}

	.landing-nav-btn {
		background: transparent;
		color: #8b949e;
		border: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		padding: 0 14px;
		height: 100%;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	.landing-nav-btn:hover {
		background: #161b22;
		color: #c9d1d9;
	}

	.landing-cta-btn {
		background: rgba(0, 212, 170, 0.12);
		color: #00d4aa;
		border: 1px solid rgba(0, 212, 170, 0.2);
		border-radius: 3px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		padding: 5px 14px;
		margin-left: 8px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.landing-cta-btn:hover {
		background: rgba(0, 212, 170, 0.25);
	}
</style>
