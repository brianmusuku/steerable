<script lang="ts">
	let {
		playing,
		stepInfo,
		speed,
		onPrev,
		onTogglePlay,
		onNext,
		onCycleSpeed
	}: {
		playing: boolean;
		stepInfo: string;
		speed: number;
		onPrev: () => void;
		onTogglePlay: () => void;
		onNext: () => void;
		onCycleSpeed: () => void;
	} = $props();
</script>

<div
	class="flex shrink-0 items-center gap-1.5 border-t border-agent-border bg-agent-surface px-3.5 py-2"
>
	<button
		class="flex cursor-pointer items-center rounded p-[5px] text-[13px] leading-none text-agent-subtle transition-colors duration-100 hover:bg-agent-border hover:text-agent-bright"
		onclick={onPrev}
		title="Previous"
	>
		&#9664;
	</button>

	<button
		class="flex cursor-pointer items-center rounded p-[5px] text-[13px] leading-none text-agent transition-colors duration-100 hover:bg-agent-muted"
		onclick={onTogglePlay}
	>
		{playing ? '&#9646;&#9646;' : '&#9654;'}
	</button>

	<button
		class="flex cursor-pointer items-center rounded p-[5px] text-[13px] leading-none text-agent-subtle transition-colors duration-100 hover:bg-agent-border hover:text-agent-bright"
		onclick={onNext}
		title="Next"
	>
		&#9654;&#9654;
	</button>

	<span class="ml-1 font-mono text-[11px] text-agent-dim">{stepInfo}</span>

	<button
		class="ml-auto cursor-pointer rounded border border-agent-border px-2 py-1 font-mono text-[10px] text-agent-dim transition-colors duration-100 hover:border-agent-dim hover:text-agent-subtle"
		onclick={onCycleSpeed}
	>
		{speed}×
	</button>
</div>
