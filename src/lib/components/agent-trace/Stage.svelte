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
							style="width: {((current + 1) / 8) * 100}%"
						></div>
						<!-- Global audio progress -->
						{#if isAudioPlaying && duration > 0}
							{@const globalProgress = (currentTime / duration) * 100}
							<div
								class="absolute top-0 left-0 h-full bg-agent transition-none"
								style="width: {globalProgress}%"
							></div>
						{/if}
					</div>
					<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
						<span class="mr-4 font-mono text-sm text-agent-dim">
							{currentAction.time}
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
					<div
						class="border-t border-agent-border/40 bg-agent-surface/50 px-8 py-6 backdrop-blur-sm"
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<div
									class={isAudioPlaying
										? 'size-2 animate-pulse rounded-full bg-agent shadow-[0_0_8px_rgba(var(--color-agent-rgb),0.5)]'
										: 'size-2 rounded-full bg-agent-dim'}
								></div>
								<span class="text-[10px] font-bold tracking-[0.2em] text-agent-dim uppercase">
									Narration Audio
								</span>
							</div>
							{#if isAudioPlaying && duration > 0}
								<span class="font-mono text-[10px] text-agent-dim/60">
									{Math.floor(currentTime)}s / {Math.floor(duration)}s
								</span>
							{/if}
						</div>
						<p class="mt-3 text-sm leading-relaxed font-medium text-agent-default/95">
							<span class="mr-1 text-lg leading-none text-agent opacity-60">“</span>
							{narration.content[current].script_text}
							<span class="ml-px text-lg leading-none text-agent opacity-60">”</span>
						</p>
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
