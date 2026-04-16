<script lang="ts">
	import ActionHeader from './ActionHeader.svelte';
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, Pause, SkipBack, SkipForward, Loader } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';
	import { narration } from '$lib/data/llm_output2';
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	let stageEl: HTMLElement | undefined;
	let volume = $state(40);
	let currentTime = $state(0);
	let { index = $bindable(-1) } = $props();
	let currentView = $derived(narration.content[index]);
	let speaking = $state(false);
	let fileTreeActive = $state(false);
	let showContent = $state(false);
	let voice = $state('am_echo');

	// ── Audio cache & pre-generation ─────────────────────────────────────
	// Map from narration index -> Object URL for the cached audio blob
	let audioCache = $state<Map<number, string>>(new Map());
	// Map from narration index -> timestamps array from the backend
	let timestampsCache = $state<Map<number, any>>(new Map());
	let pregenStatus = $state<'idle' | 'loading' | 'done' | 'error'>('idle');
	let pregenProgress = $state(0);
	let pregenTotal = $state(narration.content.length);

	// Track each clip's duration so the timer shows total across ALL clips
	let clipDurations = $state<Map<number, number>>(new Map());
	let totalDuration = $derived(Array.from(clipDurations.values()).reduce((sum, d) => sum + d, 0));
	// Cumulative elapsed = sum of durations of all completed clips + currentTime in the active clip
	let globalElapsed = $derived.by(() => {
		let elapsed = 0;
		for (let i = 0; i < index; i++) {
			elapsed += clipDurations.get(i) ?? 0;
		}
		elapsed += currentTime;
		return elapsed;
	});

	let audio: HTMLAudioElement | null = $state(null);
	let animFrameId: number = 0;

	onMount(() => {
		audio = new Audio();
		audio.volume = volume / 100;

		// Continuously sync currentTime from the audio element
		function tick() {
			if (audio && !audio.paused) {
				currentTime = audio.currentTime;
			}
			animFrameId = requestAnimationFrame(tick);
		}
		animFrameId = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(animFrameId);
			audio?.pause();
			// Revoke all cached blob URLs
			for (const url of audioCache.values()) {
				URL.revokeObjectURL(url);
			}
		};
	});

	/** Decode a base64 string into a Blob URL */
	function b64ToBlobUrl(b64: string, mime = 'audio/wav'): string {
		const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
		return URL.createObjectURL(new Blob([bytes], { type: mime }));
	}

	// ── Pre-generate all audio in parallel ───────────────────────────────
	async function pregenAll() {
		pregenStatus = 'loading';
		pregenProgress = 0;
		pregenTotal = narration.content.length;

		const newAudioCache = new Map<number, string>();
		const newTimestampsCache = new Map<number, any>();
		const newDurations = new Map<number, number>();

		// Fire all requests in parallel
		const promises = narration.content.map(async (item, i) => {
			const text = item.script_text;
			if (!text.trim()) {
				pregenProgress++;
				return;
			}

			try {
				const res = await fetch('/api/tts-kokoro', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ text, voice })
				});

				if (res.ok) {
					const payload = await res.json();
					const blobUrl = b64ToBlobUrl(payload.audio);
					newAudioCache.set(i, blobUrl);

					if (payload.timestamps) {
						newTimestampsCache.set(i, payload.timestamps);
					}
					if (payload.duration != null) {
						newDurations.set(i, payload.duration);
					}
				} else {
					console.error(`[TTS pregen] Failed step ${i}:`, await res.text());
				}
			} catch (err) {
				console.error(`[TTS pregen] Exception step ${i}:`, err);
			}

			pregenProgress++;
			// Update caches reactively so UI sees progress
			audioCache = new Map(newAudioCache);
			timestampsCache = new Map(newTimestampsCache);
			clipDurations = new Map(newDurations);
		});

		await Promise.all(promises);

		audioCache = new Map(newAudioCache);
		timestampsCache = new Map(newTimestampsCache);
		clipDurations = new Map(newDurations);
		pregenStatus = newAudioCache.size > 0 ? 'done' : 'error';
	}

	// ── Volume binding ───────────────────────────────────────────────────
	$effect(() => {
		if (audio) {
			audio.volume = volume / 100;
		}
	});

	// ── Play the audio for the current index ─────────────────────────────
	function playCurrentAudio() {
		if (!audio) return;

		const cachedUrl = audioCache.get(index);
		if (!cachedUrl) {
			console.warn(`[TTS] No cached audio for index ${index}`);
			return;
		}

		// Reset state
		audio.pause();
		audio.src = cachedUrl;
		audio.currentTime = 0;
		currentTime = 0;

		audio.onended = () => {
			speaking = false;
			// Auto-advance to next step on audio end
			if (index < narration.content.length - 1) {
				showContent = false;
				index++;
				playCurrentAudio();
			}
		};

		audio.onerror = () => {
			speaking = false;
		};

		audio
			.play()
			.then(() => {
				speaking = true;
			})
			.catch((err) => {
				console.error('[TTS] Play failed:', err);
				speaking = false;
			});
	}

	// ── Controls ─────────────────────────────────────────────────────────
	const start = () => {
		showContent = false;

		if (pregenStatus !== 'done') {
			// Start pre-generation, and when the first one is ready, play
			pregenAll().then(() => {
				if (audioCache.has(0)) {
					index = 0;
					playCurrentAudio();
				}
			});
		} else {
			index = 0;
			playCurrentAudio();
		}
	};

	const handleBack = () => {
		if (index > 0) {
			showContent = false;
			audio?.pause();
			speaking = false;
			index--;
			if (audioCache.has(index)) {
				playCurrentAudio();
			}
		}
	};

	const handleNext = () => {
		if (index < narration.content.length - 1) {
			showContent = false;
			audio?.pause();
			speaking = false;
			index++;
			if (audioCache.has(index)) {
				playCurrentAudio();
			}
		}
	};

	const handlePlay = () => {
		if (!audio) return;

		if (speaking) {
			audio.pause();
			speaking = false;
		} else {
			// If we have cached audio for current index, play it
			if (audioCache.has(index)) {
				// If already loaded for this index, just resume
				const cachedUrl = audioCache.get(index);
				if (audio.src === cachedUrl || audio.src.startsWith('blob:')) {
					audio
						.play()
						.then(() => (speaking = true))
						.catch(console.error);
				} else {
					playCurrentAudio();
				}
			}
		}
	};

	// ── Time formatting ──────────────────────────────────────────────────
	function formatTime(s: number): string {
		if (isNaN(s) || !isFinite(s)) return '0:00';
		const mins = Math.floor(s / 60);
		const secs = Math.floor(s % 60)
			.toString()
			.padStart(2, '0');
		return `${mins}:${secs}`;
	}
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
						<Tree
							filetree={currentView.filetree}
							currentFilename={currentView.filename}
							onTreeMount={() => (fileTreeActive = true)}
						/>
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
			<!-- Pre-generation status indicator -->
			{#if pregenStatus === 'loading'}
				<div class="flex items-center gap-2 px-6 py-1 text-xs text-agent-dim">
					<Loader class="size-3 animate-spin" />
					<span>Generating audio… {pregenProgress}/{pregenTotal}</span>
					<div class="h-1 flex-1 rounded-full bg-agent-border/30">
						<div
							class="h-full rounded-full bg-agent/60 transition-all duration-300"
							style="width: {(pregenProgress / pregenTotal) * 100}%"
						></div>
					</div>
				</div>
			{/if}

			<!-- Progress bar (global across all clips) -->
			<div class="relative h-[3px] shrink-0 bg-agent-border/30">
				<div
					class="absolute top-0 left-0 h-full bg-agent/20 transition-all duration-500 ease-out"
					style="width: {currentView ? ((index + 1) / narration.content.length) * 100 : 0}%"
				></div>

				{#if totalDuration > 0}
					{@const progress = (globalElapsed / totalDuration) * 100}
					<div
						class="absolute top-0 left-0 h-full bg-agent transition-none"
						style="width: {Math.min(progress, 100)}%"
					></div>
				{/if}
			</div>

			<!-- Controls -->
			<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
				<span class="mr-4 font-mono text-sm text-agent-dim">
					{formatTime(globalElapsed)} / {formatTime(totalDuration)}
				</span>

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
