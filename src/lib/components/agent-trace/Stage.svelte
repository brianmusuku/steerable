<script lang="ts">
	import ActionHeader from './ActionHeader.svelte';
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, Pause, SkipBack, SkipForward } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';
	import { narration } from '$lib/data/llm_output2';
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	let stageEl: HTMLElement | undefined;
	let volume = $state(20);
	let currentTime = $state(0);
	let duration = $state(0);
	let { index = $bindable(-1) } = $props();
	let currentView = $derived(narration.content[index]);
	let text = $state('');
	let speaking = $state(false);
	let currentUtterance: SpeechSynthesisUtterance | null = $state(null);
	let fileTreeActive = $state(false);
	let showContent = $state(false);

	// Variables to handle live volume switching workaround
	let activeText = '';
	let absoluteCharIndex = 0;
	let prevVolume = -1;
	let restartTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		const v = volume;

		// Only trigger if volume changes while speaking (skip initial mount)
		if (speaking && v !== prevVolume && prevVolume !== -1) {
			prevVolume = v;
			clearTimeout(restartTimeout);

			// Debounce to prevent glitching while dragging slider fast
			restartTimeout = setTimeout(() => {
				restartSpeechFromCurrentPosition();
			}, 100);
		} else if (prevVolume === -1) {
			prevVolume = v;
		}
	});

	function speak() {
		text = narration.content[index].script_text;
		if (!text.trim() || text.trim() === '') return;

		window.speechSynthesis.cancel();
		speaking = false;

		activeText = text;
		absoluteCharIndex = 0;

		const utterance = new SpeechSynthesisUtterance(activeText);
		utterance.volume = volume / 100;
		currentUtterance = utterance;

		// Track the exact character index of words as they are spoken
		utterance.onboundary = (event) => {
			if (currentUtterance === utterance && event.name === 'word') {
				absoluteCharIndex += event.charIndex;
			}
		};

		utterance.onstart = () => {
			if (currentUtterance === utterance) {
				speaking = true;
			}
		};

		utterance.onend = () => {
			if (currentUtterance === utterance) {
				speaking = false;
				currentUtterance = null;
				handleNext();
			}
		};

		utterance.onerror = () => {
			if (currentUtterance === utterance) {
				speaking = false;
				currentUtterance = null;
			}
		};

		window.speechSynthesis.speak(utterance);
	}

	function restartSpeechFromCurrentPosition() {
		window.speechSynthesis.cancel();

		const remainingText = activeText.substring(absoluteCharIndex);

		if (!remainingText.trim()) {
			speaking = false;
			currentUtterance = null;
			handleNext();
			return;
		}

		const utterance = new SpeechSynthesisUtterance(remainingText);
		utterance.volume = volume / 100;
		currentUtterance = utterance;

		utterance.onboundary = (event) => {
			if (currentUtterance === utterance && event.name === 'word') {
				absoluteCharIndex += event.charIndex;
			}
		};

		utterance.onstart = () => {
			if (currentUtterance === utterance) {
				speaking = true;
			}
		};

		utterance.onend = () => {
			if (currentUtterance === utterance) {
				speaking = false;
				currentUtterance = null;
				handleNext();
			}
		};

		utterance.onerror = () => {
			if (currentUtterance === utterance) {
				speaking = false;
				currentUtterance = null;
			}
		};

		window.speechSynthesis.speak(utterance);
	}

	function start() {
		showContent = false;
		index = 0;
		speak();
	}

	function stop() {
		clearTimeout(restartTimeout);
		window.speechSynthesis.cancel();
		speaking = false;
		currentUtterance = null;
	}

	const handleBack = () => {
		if (index > 0) {
			showContent = false;
			index--;
			speak();
		}
	};

	const handleNext = () => {
		if (index < narration.content.length - 1) {
			showContent = false;
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
	<div class="m-8 flex h-180 flex-col justify-between border border-gray-600">
		{#if currentView}
			{#key index}
				<ActionHeader {currentView} onComplete={() => (showContent = true)} />
			{/key}
			<div class="flex w-full flex-1 items-start justify-center gap-4 overflow-hidden p-8">
				{#if currentView.visual === 'folder tree viewer' || fileTreeActive}
					<div transition:slide={{ axis: 'x', duration: 500 }}>
						<Tree filetree={currentView.filetree} currentFilename={currentView.filename} onTreeMount={() => (fileTreeActive = true)} />
					</div>
				{/if}
				{#if currentView.visual === 'command line shell' || currentView.visual === 'file viewer' || currentView.visual === 'code diff'}
					<div transition:slide={{ axis: 'x', duration: 500 }} class="grid">
						{#if currentView.visual === 'command line shell'}
							<div class="col-start-1 row-start-1" transition:fade={{ duration: 300 }}>
								<TerminalBlock content={currentView.agents_output} />
							</div>
						{:else if currentView.visual === 'file viewer'}
							<div class="col-start-1 row-start-1" transition:fade={{ duration: 300 }}>
								<FileView
									content={{ lines: currentView.agents_output, filename: currentView.filename }}
								/>
							</div>
						{:else if currentView.visual === 'code diff'}
							<div class="col-start-1 row-start-1" transition:fade={{ duration: 300 }}>
								<DiffView content={currentView.agents_output} filename={currentView.filename} />
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<EmptyState {start} />
		{/if}

		<div>
			<div class="relative h-[3px] shrink-0 bg-agent-border/30">
				<div
					class="absolute top-0 left-0 h-full bg-agent/20 transition-all duration-500 ease-out"
					style="width: 0%"
				></div>

				{#if duration > 0}
					{@const globalProgress = (currentTime / duration) * 100}
					<div
						class="absolute top-0 left-0 h-full bg-agent transition-none"
						style="width: {globalProgress}%"
					></div>
				{/if}
			</div>
			<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
				<span class="mr-4 font-mono text-sm text-agent-dim">00:00 / 30:00 </span>

				<SkipBack class="stroke-1.5 size-4 cursor-pointer hover:text-agent" onclick={handleBack} />
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

				<Slider
					type="single"
					value={volume}
					onValueChange={(v) => {
						volume = Array.isArray(v) ? v[0] : v;
					}}
					max={100}
					step={1}
					class="max-w-30"
				/>
			</div>
		</div>
	</div>
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
