<script lang="ts">
	import type { Action } from '$lib/types/action';
	import ActionHeader from './ActionHeader.svelte';
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, Pause, SkipBack, SkipForward } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';
	import { narration } from '$lib/data/llm_output';
	import { onMount } from 'svelte';

	let {
		currentAction,
		current,
		onNext,
		onPrev
	}: {
		currentAction: Action | null;
		current: number;
		onNext: () => void;
		onPrev: () => void;
	} = $props();

	let stageEl: HTMLElement | undefined;
	let volume = $state(10);
	let currentTime = $state(0);
	let duration = $state(0);
	let index = $state(0);
	let text = $derived(narration.content[index].script_text);
	let speaking = $state(false);
	let currentUtterance: SpeechSynthesisUtterance | null = $state(null);

	$effect(() => {
		if (currentUtterance) {
			currentUtterance.volume = volume / 100;
		}
	});

	function speak() {
		if (!text.trim()) return;

		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.volume = volume / 100;
		currentUtterance = utterance;

		utterance.onstart = () => (speaking = true);
		utterance.onend = () => {
			speaking = false;
			currentUtterance = null;
			handleNext();
		};
		utterance.onerror = () => {
			speaking = false;
			currentUtterance = null;
		};

		window.speechSynthesis.speak(utterance);
	}

	function stop() {
		window.speechSynthesis.cancel();
		speaking = false;
		currentUtterance = null;
	}

	const handleBack = () => {
		if (index > 0) {
			index--;
			speak();
		}
	};

	const handleNext = () => {
		if (index < narration.content.length - 1) {
			index++;
			speak();
		}
	};

	const handlePlay = () => {
		if (speaking) {
			stop();
		} else {
			speak();
		}
	};
</script>

<main
	bind:this={stageEl}
	class="scrollbar-thin-md flex-1 justify-center overflow-x-hidden overflow-y-auto bg-agent-stage p-5"
>
	{#if currentAction}
		{#key current}
			<div class="m-8 flex h-180 flex-col justify-between border border-agent-border">
				<ActionHeader action={currentAction} />
				<div class="flex items-start gap-4 p-8">
					<Tree />

					{#if currentAction.type === 'read'}
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
					<div class="relative h-[3px] shrink-0 bg-agent-border/30">
						<!-- Overall session progress -->
						<div
							class="absolute top-0 left-0 h-full bg-agent/20 transition-all duration-500 ease-out"
							style="width: 0%"
						></div>
						<!-- Global audio progress -->
						{#if duration > 0}
							{@const globalProgress = (currentTime / duration) * 100}
							<div
								class="absolute top-0 left-0 h-full bg-agent transition-none"
								style="width: {globalProgress}%"
							></div>
						{/if}
					</div>
					<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
						<span class="mr-4 font-mono text-sm text-agent-dim"> </span>

						<SkipBack
							class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
							onclick={handleBack}
						/>
						<button onclick={handlePlay} class="flex items-center justify-center">
							{#if speaking}
								<Pause class="stroke-1.5 size-4 cursor-pointer fill-agent text-agent" />
							{:else}
								<Play class="stroke-1.5 size-4 cursor-pointer hover:text-agent" />
							{/if}
						</button>
						<SkipForward
							class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
							onclick={handleNext}
						/>
						<Slider type="single" bind:value={volume} max={100} step={1} class="max-w-30" />
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
