<script lang="ts">
	import { esc, diffBg, diffSign, diffSignColor, diffTextColor } from '$lib/lib/utils';

	interface DiffLine {
		t: 'ctx' | 'add' | 'del' | 'hunk';
		ln: string;
		text: string;
	}
	let { content, filename }: { content: string; filename?: string } = $props();

	let parsedContent = $derived(() => {
		const lines = content.split('\n');
		const parsedLines: DiffLine[] = [];
		let added = 0;
		let removed = 0;

		let i = 0;
		while (i < lines.length) {
			if (lines[i].startsWith('@@')) break;
			i++;
		}

		for (; i < lines.length; i++) {
			const line = lines[i];
			if (line.startsWith('@@')) {
				parsedLines.push({ t: 'hunk', ln: '', text: line });
			} else if (line.startsWith('+')) {
				parsedLines.push({ t: 'add', ln: '', text: line.substring(1) });
				added++;
			} else if (line.startsWith('-')) {
				parsedLines.push({ t: 'del', ln: '', text: line.substring(1) });
				removed++;
			} else if (line.startsWith(' ')) {
				parsedLines.push({ t: 'ctx', ln: '', text: line.substring(1) });
			}
		}

		return {
			filename: filename || 'unknown',
			added,
			removed,
			lines: parsedLines
		};
	});
</script>

<div class="w-120 overflow-hidden rounded-lg border border-agent-border">
	<div class="flex items-center gap-2 border-b border-agent-border bg-agent-raised px-3.5 py-[7px]">
		<span class="text-[13px] text-agent-blue underline">{@html '&#x2A57;'}</span>
		<span class="font-mono text-[11px] text-agent-bright">{parsedContent().filename}</span>
		<span class="ml-auto font-mono text-[10px] text-agent-dim">
			<span class="text-agent-green">+{parsedContent().added}</span>
			<span class="text-agent-red">-{parsedContent().removed}</span>
		</span>
	</div>

	<div class="font-mono text-[11.5px] leading-[1.65]">
		{#each parsedContent().lines as line}
			<div class="flex px-0 {diffBg(line.t)}">
				<span class="w-[15px] shrink-0 pb-px text-right text-[10px] text-agent-dim select-none">
					{line.ln}
				</span>
				<span class="w-3.5 shrink-0 {diffSignColor(line.t)}">{diffSign(line.t)}</span>
				<span class="whitespace-pre {diffTextColor(line.t)}">{line.text}</span>
			</div>
		{/each}
	</div>
</div>
