<script lang="ts">
	import { esc } from '$lib/lib/utils';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { TextPlugin } from 'gsap/dist/TextPlugin';

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
	class="w-140 overflow-hidden rounded-lg border border-agent-border text-left"
>
	<div class="text-md px-4 py-3 font-mono leading-[1.75] text-agent-default">
		<a
			class="term-line cursor-pointer underline"
			href="https://brayanmusuku.gumroad.com/l/steerable"
			target="_blank">Purchase License for indepth review.</a
		>
	</div>
</div>
