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

	let stageEl: HTMLElement | undefined;
	let volume = $state(20);
	let currentTime = $state(0);
	let duration = $state(0);
	let index = $state(-1);
	let currentView = $derived(narration.content[index]);
	let text = $derived(narration.content[index].script_text);
	let speaking = $state(false);
	let currentUtterance: SpeechSynthesisUtterance | null = $state(null);

	// Variables to handle live volume switching workaround
	let activeText = '';
	let absoluteCharIndex = 0;
	let isIntentionalCancel = false;
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
		if (!text.trim()) return;

		isIntentionalCancel = true;
		window.speechSynthesis.cancel();
		speaking = false;

		activeText = text;
		absoluteCharIndex = 0;

		const utterance = new SpeechSynthesisUtterance(activeText);
		utterance.volume = volume / 100;
		currentUtterance = utterance;
		isIntentionalCancel = false;

		// Track the exact character index of words as they are spoken
		utterance.onboundary = (event) => {
			if (event.name === 'word') {
				absoluteCharIndex += event.charIndex;
			}
		};

		utterance.onstart = () => (speaking = true);

		utterance.onend = () => {
			if (!isIntentionalCancel) {
				speaking = false;
				currentUtterance = null;
				handleNext();
			}
		};

		utterance.onerror = () => {
			if (!isIntentionalCancel) {
				speaking = false;
				currentUtterance = null;
			}
		};

		window.speechSynthesis.speak(utterance);
	}

	function restartSpeechFromCurrentPosition() {
		isIntentionalCancel = true;
		window.speechSynthesis.cancel();

		const remainingText = activeText.substring(absoluteCharIndex);

		if (!remainingText.trim()) {
			isIntentionalCancel = false;
			speaking = false;
			currentUtterance = null;
			handleNext();
			return;
		}

		const utterance = new SpeechSynthesisUtterance(remainingText);
		utterance.volume = volume / 100;
		currentUtterance = utterance;
		isIntentionalCancel = false;

		utterance.onboundary = (event) => {
			if (event.name === 'word') {
				absoluteCharIndex += event.charIndex;
			}
		};

		utterance.onstart = () => (speaking = true);

		utterance.onend = () => {
			if (!isIntentionalCancel) {
				speaking = false;
				currentUtterance = null;
				handleNext();
			}
		};

		utterance.onerror = () => {
			if (!isIntentionalCancel) {
				speaking = false;
				currentUtterance = null;
			}
		};

		window.speechSynthesis.speak(utterance);
	}

	function stop() {
		isIntentionalCancel = true;
		clearTimeout(restartTimeout);
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
	<div class="m-8 flex h-180 flex-col justify-between border border-agent-border">
		{#if currentView}
			<ActionHeader {currentView} />
			<div class="flex items-start justify-center gap-4 p-8">
				{#if currentView.visual === 'folder tree viewer'}
					<Tree filetree={currentView.filetree} />
				{:else if currentView.visual === 'command line shell'}
					<TerminalBlock content={currentView.agents_output} />
				{:else if currentView.visual === 'file viewer'}
					<FileView
						content={{ lines: currentView.agents_output, filename: currentView.filename }}
					/>
				{:else if currentView.visual === 'code diff'}
					<DiffView content={currentView.agents_output} filename={currentView.filename} />
				{/if}
			</div>
		{:else}
			<EmptyState />
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
