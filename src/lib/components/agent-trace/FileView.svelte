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

	onMount(() => {
		// gsap.registerPlugin(TextPlugin);
		// const tl = gsap.timeline();
		// tl.from(container, {
		// 	y: 20,
		// 	opacity: 0,
		// 	duration: 0.8,
		// 	ease: 'power2.out'
		// });
		// const lineEls = container.querySelectorAll('.file-line');
		// lineEls.forEach((el) => {
		// 	const node = el as HTMLElement;
		// 	const originalText = node.innerText;
		// 	node.innerText = '';
		// 	tl.to(node, {
		// 		text: originalText,
		// 		duration: Math.max(originalText.length * 0.02, 0.1),
		// 		ease: 'none'
		// 	});
		// });
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

	<div class="font-mono text-[11.5px] leading-[1.65]">
		{#each content.lines.split('\n') as line, i}
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
