<script lang="ts">
	import { onMount } from 'svelte';
	import type { Action } from '$lib/types/action';
	import { ACTIONS } from '$lib/data/action';
	import Timeline from './Timeline.svelte';
	import Stage from './Stage.svelte';

	const SPEEDS: number[] = [1, 2, 4];

	let current: number = $state(0);
	let playing: boolean = $state(false);
	let speed: number = $state(1);
	let timer: ReturnType<typeof setTimeout> | undefined;

	let progress: number = $derived(
		current < 0 ? 0 : Math.round(((current + 1) / ACTIONS.length) * 100)
	);

	let stepInfo: string = $derived(`${current < 0 ? '—' : current + 1} / ${ACTIONS.length}`);

	let currentAction: Action | null = $derived(current >= 0 ? ACTIONS[current] : null);

	function jumpTo(idx: number): void {
		current = idx;
		if (playing) schedNext();
	}

	function nextStep(): void {
		if (current < ACTIONS.length - 1) {
			jumpTo(current + 1);
		} else {
			playing = false;
			clearTimeout(timer);
		}
	}

	function prevStep(): void {
		if (current > 0) jumpTo(current - 1);
	}

	function togglePlay(): void {
		playing = !playing;
		if (playing) {
			if (current >= ACTIONS.length - 1) current = -1;
			nextStep();
		} else {
			clearTimeout(timer);
		}
	}

	function schedNext(): void {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (playing) nextStep();
		}, 2500 / speed);
	}

	function cycleSpeed(): void {
		const idx: number = SPEEDS.indexOf(speed);
		speed = SPEEDS[(idx + 1) % SPEEDS.length];
	}

	onMount(() => () => clearTimeout(timer));
</script>

<div
	class="dark flex h-screen flex-col overflow-hidden border border-agent-border bg-agent font-sans text-agent-default"
>
	<div
		class="flex shrink-0 items-center gap-2.5 border-b border-agent-border bg-agent-surface px-4 py-2.5"
	>
		<span
			class="rounded bg-agent-muted px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-agent uppercase"
		>
			AgentTrace
		</span>
		<span class="font-mono text-xs text-agent-dim">
			session · build-auth-system · {ACTIONS.length} steps
		</span>
	</div>

	<div class="flex min-h-0 flex-1">
		<Timeline {current} actions={ACTIONS} onJump={jumpTo} />
		<Stage {currentAction} {current} />
	</div>
</div>
