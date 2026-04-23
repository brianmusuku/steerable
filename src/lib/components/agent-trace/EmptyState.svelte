<script lang="ts">
	import { Loader, Play } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';

	let {
		start,
		pregenStatus,
		pregenProgress,
		pregenTotal
	}: {
		start: () => void;
		pregenStatus: string;
		pregenProgress: number;
		pregenTotal: number;
	} = $props();
</script>

<div class="flex h-full flex-1 flex-col items-center justify-center p-8">
	{#if pregenStatus === 'loading'}
		<div class="flex w-full max-w-md flex-col items-center gap-8" in:slide={{ axis: 'y' }}>
			<div class="relative flex items-center justify-center">
				<Loader class="size-12 animate-spin text-agent" />
				<div class="absolute size-16 animate-pulse rounded-full border border-agent/20"></div>
			</div>

			<div class="flex w-full flex-col items-center gap-4">
				<div
					class="flex w-full justify-between text-[11px] font-bold tracking-widest text-agent-subtle uppercase"
				>
					<span>Vocals Synthesis</span>
					<span class="font-mono">{Math.round((pregenProgress / (pregenTotal || 1)) * 100)}%</span>
				</div>

				<div class="h-1.5 w-full overflow-hidden rounded-full bg-agent-border/30">
					<div
						class="h-full bg-agent/60 transition-all duration-500 ease-out"
						style="width: {(pregenProgress / (pregenTotal || 1)) * 100}%"
					></div>
				</div>

				<span class="font-mono text-[11px] text-agent-dim">
					Processing step {pregenProgress} of {pregenTotal}
				</span>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-8" in:fade>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="group relative flex cursor-pointer items-center justify-center transition-transform hover:scale-105 active:scale-95"
				onclick={start}
			>
				<div class="absolute size-28 animate-ping rounded-full bg-agent/10 duration-[3s]"></div>
				<div
					class="relative flex size-24 items-center justify-center rounded-full border border-agent/20 bg-agent-surface shadow-2xl transition-all group-hover:border-agent/40 group-hover:bg-agent-surface/80"
				>
					<Play
						class="ml-1 size-10 fill-agent text-agent group-hover:fill-agent-bright group-hover:text-agent-bright"
					/>
				</div>
			</div>

			<div class="flex flex-col items-center gap-1.5 text-center">
				<span class="text-base font-semibold tracking-tight text-agent-bright"
					>Ready to Experience</span
				>
				<span class="text-[11px] font-bold tracking-[0.2em] text-agent-dim uppercase opacity-80"
					>Click to begin the walk-through</span
				>
			</div>
		</div>
	{/if}
</div>
