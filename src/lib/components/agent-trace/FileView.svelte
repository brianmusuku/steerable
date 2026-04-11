<script lang="ts">
	import type { FileContent } from '$lib/types/action';
	import { esc } from '$lib/lib/utils';

	let {
		content,
		badge = 'new',
		icon = '&#x2B;',
		iconColor = 'text-agent-yellow'
	}: {
		content: FileContent;
		badge?: string;
		icon?: string;
		iconColor?: string;
	} = $props();
</script>

<div class="overflow-hidden rounded-lg border border-agent-border">
	<div class="flex items-center gap-2 border-b border-agent-border bg-agent-raised px-3.5 py-[7px]">
		<span class="text-[13px] {iconColor}">{@html icon}</span>
		<span class="font-mono text-[11px] text-agent-bright">{content.filename}</span>
		<span
			class="rounded px-[7px] py-px text-[9px] font-bold tracking-[0.06em] uppercase
        {badge === 'new'
				? 'bg-agent-green-bg text-agent-green'
				: 'bg-agent-orange-bg text-agent-orange'}"
		>
			{badge}
		</span>
	</div>

	<div class="font-mono text-[11.5px] leading-[1.65]">
		{#each content.lines as line, i}
			<div class="flex px-3.5 hover:bg-agent-raised">
				<span
					class="w-[34px] shrink-0 pr-2.5 pb-px text-right text-[10px] text-agent-dim select-none"
				>
					{i + 1}
				</span>
				<span class="whitespace-pre text-agent-default">{esc(line)}</span>
			</div>
		{/each}
	</div>
</div>
