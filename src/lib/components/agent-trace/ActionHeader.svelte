<script lang="ts">
	import { onMount } from 'svelte';
	import { Folder } from '@lucide/svelte';
	import gsap from 'gsap';
	import SplitText from 'gsap/SplitText';

	gsap.registerPlugin(SplitText);

	let { currentView } = $props();
	let titleEl: HTMLElement;

	onMount(() => {
		const split = new SplitText(titleEl, { type: 'chars' });
		gsap.from(split.chars, {
			x: 70,
			opacity: 0,
			duration: 0.7,
			ease: 'power4',
			stagger: 0.04
		});
	});
</script>

<div class="mb-4 flex items-center gap-2.5 p-8">
	<div
		class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-agent-green-bg text-[15px] text-agent-green"
	>
		<Folder class="size-4" />
	</div>

	<div class="min-w-0 flex-1">
		<div class="font-mono text-[9px] font-bold tracking-widest text-agent-dim uppercase">
			{currentView.filename}
		</div>
		<div bind:this={titleEl} class="mt-px text-sm font-semibold text-agent-bright">
			{currentView.title}
		</div>
	</div>
</div>
