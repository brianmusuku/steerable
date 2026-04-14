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
	let volume = $state(40);
	let isLoading = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isAudioPlaying = $state(false);

	// Audio player and cache
	let audioEl: HTMLAudioElement | undefined;
	let batchAudioUrl = $state<string | null>(null);
	let batchTimestamps = $state<number[]>([]);

	onMount(() => {
		audioEl = new Audio();
		audioEl.volume = volume / 100;

		// Batch generate animations
		(async () => {
			try {
				const texts = narration.content.map((c) => c.script_text);
				const response = await fetch('/api/tts', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ texts })
				});
				if (response.ok) {
					const data = await response.json();
					batchAudioUrl = `/audio/cache/${data.hash}.mp3`;
					batchTimestamps = data.timestamps;
				}
			} catch (err) {
				console.error('Batch TTS failed:', err);
			}
		})();

		return () => {
			audioEl?.pause();
		};
	});

	async function playNarration() {
		if (!audioEl || typeof window === 'undefined' || !batchAudioUrl) return;

		const fullUrl = window.location.origin + batchAudioUrl;

		if (audioEl.src !== fullUrl) {
			audioEl.src = fullUrl;
			audioEl.load();
			audioEl.oncanplay = () => {
				if (audioEl && isAudioPlaying) {
					audioEl.play().catch((err) => console.error('Audio play failed:', err));
				}
			};
		} else {
			if (isAudioPlaying) {
				if (audioEl.paused) {
					audioEl.play().catch((err) => console.error('Audio play failed:', err));
				}
			} else {
				audioEl.pause();
			}
		}
	}

	function handlePlay() {
		isAudioPlaying = !isAudioPlaying;
	}

	function handleNext() {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		onNext();
	}

	function handleBack() {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		onPrev();
	}

	// React to internal audio play/pause state change
	$effect(() => {
		if (isAudioPlaying) {
			playNarration();
		} else {
			audioEl?.pause();
		}
	});

	// Connect audio element state to Svelte state
	$effect(() => {
		if (!audioEl) return;

		const updateState = () => {
			if (audioEl) {
				currentTime = audioEl.currentTime;
				duration = audioEl.duration;
			}
		};

		audioEl.addEventListener('timeupdate', updateState);
		audioEl.addEventListener('loadedmetadata', updateState);

		return () => {
			audioEl?.removeEventListener('timeupdate', updateState);
			audioEl?.removeEventListener('loadedmetadata', updateState);
		};
	});

	// Connect volume slider to audio element
	$effect(() => {
		if (audioEl) {
			audioEl.volume = volume / 100;
		}
	});

	function formatTime(s: number) {
		if (isNaN(s) || !isFinite(s)) return '0:00';
		return `${Math.floor(s / 60)}:${Math.floor(s % 60)
			.toString()
			.padStart(2, '0')}`;
	}

	$effect(() => {
		currentAction;
		if (stageEl) stageEl.scrollTop = 0;
	});
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
						<span class="mr-4 font-mono text-sm text-agent-dim">
							{formatTime(currentTime)} / {formatTime(duration)}
						</span>

						<SkipBack
							class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
							onclick={handleBack}
						/>
						<button onclick={handlePlay} class="flex items-center justify-center">
							{#if isAudioPlaying}
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
