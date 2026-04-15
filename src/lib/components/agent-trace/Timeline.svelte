<script lang="ts">
	import TimelineItem from './TimelineItem.svelte';

	let {
		current,
		actions,
		onJump
	}: {
		current: number;
		actions: any[];
		onJump: (idx: number) => void;
	} = $props();

	$effect(() => {
		current;
		if (current >= 0) {
			document.getElementById(`ch-${current}`)?.scrollIntoView({ block: 'nearest' });
		}
	});
</script>

<aside
	class="scrollbar-thin w-[252px] shrink-0 overflow-y-auto border-r border-agent-border bg-agent-surface"
>
	<div
		class="px-3.5 pt-2.5 pb-1 font-mono text-[9px] font-bold tracking-[0.12em] text-agent-dim uppercase"
	>
		Timeline
	</div>

	{#each actions as action, i}
		<TimelineItem
			{action}
			index={i}
			isDone={i < current}
			isActive={i === current}
			onJump={() => onJump(i)}
		/>
	{/each}
</aside>
