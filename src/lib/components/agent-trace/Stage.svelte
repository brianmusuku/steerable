<script lang="ts">
	import type { Action } from '$lib/types/action';
	import ActionHeader from './ActionHeader.svelte';
	import ThoughtBlock from './ThoughtBlock.svelte';
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, SkipBack, SkipForward } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';

	let {
		currentAction,
		current
	}: {
		currentAction: Action | null;
		current: number;
	} = $props();

	let stageEl: HTMLElement | undefined;

	$effect(() => {
		currentAction;
		if (stageEl) stageEl.scrollTop = 0;
	});

	let value = $state(50);
</script>

<main
	bind:this={stageEl}
	class="scrollbar-thin-md flex-1 justify-center overflow-x-hidden overflow-y-auto bg-agent-stage p-5"
>
	{#if currentAction}
		{#key current}
			<div class="m-8 flex h-180 flex-col justify-between border border-agent-border">
				<ActionHeader action={currentAction} />
				<div class="flex gap-4 p-8">
					<Tree />

					{#if currentAction.type === 'thought'}
						<!-- TypeScript narrows content to ThoughtContent here -->
						<ThoughtBlock content={currentAction.content} />
					{:else if currentAction.type === 'read'}
						<FileView
							content={currentAction.content}
							badge="reading"
							icon="&#x1F4C4;"
							iconColor="text-agent-orange"
						/>
					{:else if currentAction.type === 'file'}
						<FileView
							content={currentAction.content}
							badge={currentAction.content.badge || 'new'}
							icon="&#x2B;"
							iconColor="text-agent-yellow"
						/>
					{:else if currentAction.type === 'diff'}
						<DiffView content={currentAction.content} />
					{:else if currentAction.type === 'terminal'}
						<TerminalBlock content={currentAction.content} />
					{/if}
				</div>
				<div>
					<div class="h-[2px] shrink-0 bg-agent-border">
						<div
							class="h-full bg-agent transition-all duration-500 ease-out"
							style="width: {44}%"
						></div>
					</div>
					<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
						<span class="mr-4 font-mono text-sm text-agent-dim">
							{currentAction.time}
						</span>

						<SkipBack class="stroke-1.5 size-4 cursor-pointer" />
						<Play class="stroke-1.5 size-4 cursor-pointer" />
						<SkipForward class="stroke-1.5 size-4 cursor-pointer" />
						<Slider type="single" bind:value max={100} step={1} class="max-w-30" />
					</div>
				</div>
			</div>
		{/key}
	{:else}
		<EmptyState />
	{/if}
</main>

<style>
	:global([data-slot='slider-track']) {
		background-color: var(--color-agent-dim);
		height: 4px;
	}

	:global([data-slot='slider-range']) {
		background-color: var(--color-agent);
		height: 4px;
	}
</style>
