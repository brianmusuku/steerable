<script lang="ts">
	import type { DiffContent } from '$lib/types/action';
	import { esc, diffBg, diffSign, diffSignColor, diffTextColor } from '$lib/lib/utils';

	let { content }: { content: DiffContent } = $props();
</script>

<div class="overflow-hidden rounded-lg border border-agent-border">
	<div class="flex items-center gap-2 border-b border-agent-border bg-agent-raised px-3.5 py-[7px]">
		<span class="text-[13px] text-agent-blue">{@html '&#x2A57;'}</span>
		<span class="font-mono text-[11px] text-agent-bright">{content.filename}</span>
		<span class="ml-auto font-mono text-[10px] text-agent-dim">
			<span class="text-agent-green">+{content.added}</span>
			<span class="text-agent-red">-{content.removed}</span>
		</span>
	</div>

	<div class="font-mono text-[11.5px] leading-[1.65]">
		{#each content.lines as line}
			<div class="flex px-3.5 {diffBg(line.t)}">
				<span
					class="w-[34px] shrink-0 pr-2.5 pb-px text-right text-[10px] text-agent-dim select-none"
				>
					{line.ln}
				</span>
				<span class="w-3.5 shrink-0 {diffSignColor(line.t)}">{diffSign(line.t)}</span>
				<span class="whitespace-pre {diffTextColor(line.t)}">{esc(line.text)}</span>
			</div>
		{/each}
	</div>
</div>
