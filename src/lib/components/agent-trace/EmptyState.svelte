<script lang="ts">
	import { Loader, Play } from '@lucide/svelte';

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

{#if pregenStatus === 'loading'}
	<div class="flex items-center gap-2 px-6 py-1 text-xs text-agent-dim">
		<Loader class="size-3 animate-spin" />
		<span>Generating video… {pregenProgress}/{pregenTotal}</span>
		<div class="h-1 flex-1 rounded-full bg-agent-border/30">
			<div
				class="h-full rounded-full bg-agent/60 transition-all duration-300"
				style="width: {(pregenProgress / pregenTotal) * 100}%"
			></div>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col items-center justify-center gap-2.5 text-[13px] text-agent-dim">
		<Play class="size-12 cursor-pointer fill-agent stroke-0" onclick={start} />
		<span>Press play to begin</span>
		<span class="font-mono text-[11px]">or click any step in the timeline</span>
	</div>
{/if}
