<script lang="ts">
	import { esc } from '$lib/lib/utils';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';

	let { content } = $props();
	let lines = $derived(content.split('\n'));

	let container: HTMLDivElement;

	onMount(() => {
		gsap.registerPlugin(TextPlugin);
		const tl = gsap.timeline();

		tl.from(container, {
			y: 20,
			opacity: 0,
			duration: 0.8,
			ease: 'power2.out'
		});

		const lineEls = container.querySelectorAll('.term-line');

		lineEls.forEach((el) => {
			const node = el as HTMLElement;
			const originalText = node.innerText;
			node.innerText = '';
			tl.to(node, {
				text: originalText,
				duration: Math.max(originalText.length * 0.02, 0.1),
				ease: 'none'
			});
		});
	});
</script>

<div
	bind:this={container}
	class="w-120 overflow-hidden rounded-lg border border-agent-border text-left"
>
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
				<span class="term-line text-agent-blue">{esc(line)}</span>
			</div>
		{/each}
	</div>
</div>
