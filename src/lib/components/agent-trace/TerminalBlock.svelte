<script lang="ts">
	import { esc } from '$lib/lib/utils';

	let { content } = $props();
	let lines = $derived(content.split('\n'));
</script>

<div class="w-120 overflow-hidden rounded-lg border border-agent-border">
	<div
		class="flex items-center gap-[5px] border-b border-agent-border bg-agent-raised px-3 py-[7px]"
	>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-red"></div>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-yellow"></div>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-green"></div>
		<span class="ml-1.5 font-mono text-[10px] text-agent-dim"> terminal </span>
	</div>

	<div class="px-4 py-3 font-mono text-xs leading-[1.75] text-agent-default">
		{#each lines as line, i}
			<div>
				{#if i === 0}
					<span class="text-agent-green">❯</span>
				{/if}
				<span class="text-agent-blue">{esc(line)}</span>
			</div>
		{/each}
	</div>
</div>
