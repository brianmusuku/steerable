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
		playing,
		onTogglePlay,
		onNext,
		onPrev
	}: {
		currentAction: Action | null;
		current: number;
		playing: boolean;
		onTogglePlay: () => void;
		onNext: () => void;
		onPrev: () => void;
	} = $props();

	let stageEl: HTMLElement | undefined;
	let narrationIndex = $state(0);
	let volume = $state(80);
	let isLoading = $state(false);

	// Audio player and cache
	let audioEl: HTMLAudioElement | undefined;
	const audioCache = new Map<number, string>(); // index -> blob URL

	onMount(() => {
		audioEl = new Audio();
		audioEl.volume = volume / 100;

		return () => {
			// Cleanup blob URLs and audio on unmount
			audioEl?.pause();
			audioCache.forEach((url) => URL.revokeObjectURL(url));
			audioCache.clear();
		};
	});

	async function fetchTTSAudio(text: string): Promise<string | null> {
		try {
			const response = await fetch('/api/tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text })
			});

			if (!response.ok) {
				const errText = await response.text();
				console.error('TTS API error:', response.status, errText);
				return null;
			}

			// Server returns binary WAV audio directly
			const blob = await response.blob();
			return URL.createObjectURL(blob);
		} catch (err) {
			console.error('Failed to fetch TTS audio:', err);
			return null;
		}
	}

	async function playNarration() {
		if (!audioEl || typeof window === 'undefined') return;

		// Stop current playback
		audioEl.pause();
		audioEl.currentTime = 0;

		isLoading = true;

		// Check cache first
		let audioUrl = audioCache.get(narrationIndex);
		if (!audioUrl) {
			const text = narration.content[narrationIndex].script_text;
			audioUrl = (await fetchTTSAudio(text)) ?? undefined;
			if (audioUrl) {
				audioCache.set(narrationIndex, audioUrl);
			}
		}

		isLoading = false;

		if (!audioUrl || !playing) return;

		audioEl.src = audioUrl;
		audioEl.volume = volume / 100;
		audioEl.play().catch((err) => console.error('Audio play failed:', err));
	}

	function handlePlay() {
		onTogglePlay();
	}

	function handleNext() {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		if (narrationIndex < narration.content.length - 1) {
			narrationIndex++;
		}
		onNext();
		if (playing) playNarration();
	}

	function handleBack() {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		if (narrationIndex > 0) {
			narrationIndex--;
		}
		onPrev();
		if (playing) playNarration();
	}

	// React to play/pause
	$effect(() => {
		if (playing) {
			playNarration();
		} else {
			if (audioEl) {
				audioEl.pause();
				audioEl.currentTime = 0;
			}
		}
	});

	// Connect volume slider to audio element
	$effect(() => {
		if (audioEl) {
			audioEl.volume = volume / 100;
		}
	});

	// Auto-advance to next narration when current finishes
	$effect(() => {
		if (!audioEl) return;
		const handler = () => {
			if (playing && narrationIndex < narration.content.length - 1) {
				narrationIndex++;
				playNarration();
			} else if (narrationIndex === narration.content.length - 1) {
				if (playing) onTogglePlay();
			}
		};
		audioEl.addEventListener('ended', handler);
		return () => audioEl?.removeEventListener('ended', handler);
	});

	// Preload next narration audio
	$effect(() => {
		const nextIdx = narrationIndex + 1;
		if (nextIdx < narration.content.length && !audioCache.has(nextIdx)) {
			const text = narration.content[nextIdx].script_text;
			fetchTTSAudio(text).then((url) => {
				if (url) audioCache.set(nextIdx, url);
			});
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

						<SkipBack
							class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
							onclick={handleBack}
						/>
						<button onclick={handlePlay} class="flex items-center justify-center">
							{#if playing}
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
					<div class="bg-agent-surface/30 border-t border-agent-border px-8 py-6">
						<div class="flex items-center gap-2">
							<div class={playing ? 'size-1.5 animate-pulse rounded-full bg-agent' : 'size-1.5 rounded-full bg-agent-dim'}></div>
							<span class="text-[10px] font-bold tracking-widest text-agent-dim uppercase">
								Narration Sequence {narrationIndex + 1} / {narration.content.length}
							</span>
						</div>
						<p class="mt-2 text-sm leading-relaxed text-agent-default/90 italic">
							"{narration.content[narrationIndex].script_text}"
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
