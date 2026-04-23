<script lang="ts">
	import { esc, diffBg, diffSign, diffSignColor, diffTextColor } from '$lib/lib/utils';

	interface DiffLine {
		t: 'ctx' | 'add' | 'del' | 'hunk';
		ln: string;
		text: string;
	}
	let { content, filename }: { content: string; filename?: string } = $props();

	// Use $derived.by for block-level derivation in Svelte 5
	let parsedContent = $derived.by(() => {
		// Fix 1: Properly split by actual newline OR literal string "\n" (with optional \r)
		const lines = content.split(/(?:\\r)?\\n|\r?\n/);

		// Remove trailing empty line if present
		if (lines.length > 0 && lines[lines.length - 1] === '') {
			lines.pop();
		}

		const parsedLines: DiffLine[] = [];
		let added = 0;
		let removed = 0;
		let extractedFilename = filename;

		let i = 0;
		while (i < lines.length) {
			const line = lines[i];
			if (line.startsWith('@@')) break;

			// Bonus: Automatically extract filename from the diff header if not passed as prop
			if (line.startsWith('+++ ')) {
				if (!extractedFilename) {
					let f = line.substring(4).trim().split('\t')[0]; // Strip timestamps
					if (f.startsWith('b/')) f = f.substring(2); // Strip git 'b/' prefix
					extractedFilename = f;
				}
			}
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
			} else if (line === '') {
				// Fix 2: Handle fully empty context lines (missing space prefix)
				parsedLines.push({ t: 'ctx', ln: '', text: '' });
			} else {
				// Fallback for weirdly formatted lines (e.g. '\ No newline at end of file')
				parsedLines.push({ t: 'ctx', ln: '', text: line });
			}
		}

		return {
			filename: extractedFilename || 'unknown',
			added,
			removed,
			lines: parsedLines
		};
	});
</script>

<div class="w-140 overflow-hidden rounded-lg border border-agent-border">
	<div class="flex items-center gap-2 border-b border-agent-border bg-agent-raised px-3.5 py-[7px]">
		<span class="text-[13px] text-agent-blue underline">{@html '&#x2A57;'}</span>
		<!-- Note: Removed the () call execution for derived states here -->
		<span class="font-mono text-[11px] text-agent-bright">{parsedContent.filename}</span>
		<span class="ml-auto font-mono text-[10px] text-agent-dim">
			<span class="text-agent-green">+{parsedContent.added}</span>
			<span class="text-agent-red">-{parsedContent.removed}</span>
		</span>
	</div>

	<div class="font-mono text-[11.5px] leading-[1.65]">
		{#each parsedContent.lines as line}
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
