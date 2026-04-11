<script lang="ts">
	import type { TerminalContent } from '$lib/types/action';
	import { esc, terminalLineColor } from '$lib/lib/utils';

	let { content }: { content: TerminalContent } = $props();
</script>

<div class="overflow-hidden rounded-lg border border-agent-border">
	<div
		class="flex items-center gap-[5px] border-b border-agent-border bg-agent-raised px-3 py-[7px]"
	>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-red"></div>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-yellow"></div>
		<div class="h-[10px] w-[10px] rounded-full bg-agent-green"></div>
		<span class="ml-1.5 font-mono text-[10px] text-agent-dim">
			{content.cwd} — zsh
		</span>
	</div>

	<div class="px-4 py-3 font-mono text-xs leading-[1.75] text-agent-default">
		{#each content.lines as line}
			{#if line.t === 'cmd'}
				<div>
					<span class="text-agent-green">❯</span>
					<span class="text-agent-blue">{esc(line.text)}</span>
				</div>
			{:else}
				<div class={terminalLineColor(line.t)}>{esc(line.text)}</div>
			{/if}
		{/each}
	</div>
</div>
