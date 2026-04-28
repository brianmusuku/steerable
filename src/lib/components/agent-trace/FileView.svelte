<script lang="ts">
	import { esc } from '$lib/lib/utils';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';

	let {
		content,
		badge = 'new',
		icon = '&#x2B;',
		iconColor = 'text-agent-yellow'
	}: {
		content: { lines: string; filename: string };
		badge?: string;
		icon?: string;
		iconColor?: string;
	} = $props();

	let container: HTMLDivElement;

	// FIX: Handle both actual newlines and literal '\n' characters from LLM output
	let parsedLines = $derived(content.lines.replace(/\\n/g, '\n').split('\n'));

	onMount(() => {
		// GSAP code is safe to uncomment when ready
	});
</script>

<div
	bind:this={container}
	class="w-140 overflow-hidden rounded-lg border border-agent-border text-left"
>
	<div class="flex items-center gap-2 border-b border-agent-border bg-agent-raised px-3.5 py-[7px]">
		<span class="text-[13px] {iconColor}">{@html icon}</span>
		<span class="font-mono text-[11px] text-agent-bright">{content.filename}</span>
	</div>

	<div class="hide-scrollbar max-h-130 overflow-auto font-mono text-[11.5px] leading-[1.65]">
		<!-- Loop over the derived parsedLines instead of inline splitting -->
		{#each parsedLines as line, i}
			<div class="flex px-3.5 hover:bg-agent-raised">
				<span
					class="w-[34px] shrink-0 pr-2.5 pb-px text-right text-[10px] text-agent-dim select-none"
				>
					{i + 1}
				</span>
				<span class="file-line whitespace-pre text-agent-default">{esc(line)}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari, Edge */
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for Firefox */
	.hide-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none; /* IE and Edge */
	}
</style>
