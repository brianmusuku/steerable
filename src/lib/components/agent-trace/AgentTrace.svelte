<script lang="ts">
	import Timeline from './Timeline.svelte';
	import Stage from './Stage.svelte';
	import { onMount } from 'svelte';
	import { Loader } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	let { narration = null, id = 'default' } = $props();

	let currentNarration = $state(narration);
	let loading = $state(!narration);
	let error = $state<string | null>(null);
	let current: number = $state(-1);

	onMount(async () => {
		if (!currentNarration) {
			try {
				const response = await fetch('/api/narration', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id })
				});
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to generate narration script');
				}
				const data = await response.json();
				currentNarration = data.narration;
			} catch (e) {
				error = e instanceof Error ? e.message : 'An unexpected error occurred';
			} finally {
				loading = false;
			}
		}
	});
</script>

<div
	class="dark flex h-screen flex-col overflow-hidden border border-agent-border bg-agent-stage font-sans text-agent-default"
>
	{#if loading}
		<div
			class="flex flex-1 flex-col items-center justify-center gap-8 bg-agent-stage"
			in:fade={{ duration: 400 }}
		>
			<div class="relative flex items-center justify-center">
				<Loader class="size-12 animate-spin text-agent" />
				<div class="absolute size-16 animate-pulse rounded-full border border-agent/20"></div>
			</div>
			<div class="flex flex-col items-center gap-3 text-center">
				<div class="flex flex-col items-center gap-1">
					<span class="text-[11px] font-bold tracking-[0.3em] text-agent uppercase"
						>Initializing Environment</span
					>
					<div class="h-0.5 w-8 rounded-full bg-agent/30"></div>
				</div>
				<span class="max-w-xs text-sm font-medium text-agent-subtle"
					>Generating video script from reasoning trace...</span
				>
			</div>
		</div>
	{:else if error}
		<div class="flex flex-1 flex-col items-center justify-center gap-8 bg-agent-stage" in:fade>
			<div
				class="flex size-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5"
			>
				<div
					class="flex size-10 items-center justify-center rounded-full border-2 border-red-500/40"
				>
					<span class="text-xl font-bold text-red-500">!</span>
				</div>
			</div>
			<div class="flex flex-col items-center gap-2 text-center">
				<span class="text-[11px] font-bold tracking-[0.3em] text-red-500 uppercase"
					>Generation Failed</span
				>
				<span class="max-w-md text-sm leading-relaxed font-medium text-agent-dim">{error}</span>
			</div>
			<button
				class="landing-cta-btn border-red-500/20! bg-red-500/10! text-red-400! transition-all hover:bg-red-500/20! active:scale-95"
				onclick={() => window.location.reload()}
			>
				Try Again
			</button>
		</div>
	{:else if currentNarration}
		<div
			class="flex shrink-0 items-center gap-2.5 border-b border-agent-border bg-agent-surface px-4 py-2.5"
		></div>

		<header class="landing-topbar">
			<div class="landing-brand">STEERABLE</div>
			<div class="landing-path">
				<span class="text-agent-subtle">reasoning traces</span>
				<span class="text-agent-dim">→</span>
				<span class="text-agent">{currentNarration.content.length} steps</span>
			</div>
			<nav class="landing-nav">
				<button class="landing-nav-btn">unlock audio</button>
			</nav>
		</header>

		<div class="flex min-h-0 flex-1" in:fade={{ duration: 600, delay: 200 }}>
			<Timeline {current} actions={currentNarration.content} onJump={(i) => (current = i)} />
			<Stage bind:index={current} narration={currentNarration} {id} autoStart={true} />
		</div>
	{/if}
</div>

<style>
	/* ─── Topbar ──────────────────────────────────────────────────── */
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
