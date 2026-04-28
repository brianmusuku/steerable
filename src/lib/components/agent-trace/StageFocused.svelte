<script lang="ts">
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, Pause, SkipBack, SkipForward, RotateCcw } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { SvelteMap } from 'svelte/reactivity';
	import { getCachedTTS, saveTTS } from '$lib/utils/ttsCache';

	let { narration, id, index = $bindable(-1), autoStart = false } = $props();

	let stageEl: HTMLElement | undefined;
	let volume = $state(40);
	let currentTime = $state(0);
	let speaking = $state(false);
	let voice = $state('am_echo');
	let playbackComplete = $state(false);

	let currentView = $derived(narration.content[index]);

	// ── AUDIO PREGEN AND CACHE (Using SvelteMap) ────────────────────────
	let audioCache = new SvelteMap<number, string>();
	let timestampsCache = new SvelteMap<number, any>();
	let clipDurations = new SvelteMap<number, number>();

	let pregenStatus = $state<'idle' | 'loading' | 'done' | 'error'>('idle');
	let pregenProgress = $state(0);
	let pregenTotal = $state(narration.content.length);

	// ── PERFORMANCE FIX: INTERMEDIATE BOOLEAN ───────────────────────────
	let currentStepIsVisible = $derived.by(() => {
		if (index < 0) return false;
		const item = narration.content[index];
		if (!item) return false;

		const phrase = item.script_text_3word_phrase_where_visual_starts;
		const timestamps = timestampsCache.get(index);

		if (phrase && timestamps) {
			const startTime = findPhraseStartTime(timestamps, phrase);
			if (currentTime < startTime - 1.8) {
				return false;
			}
		}
		return true;
	});

	// ── TIMING & HIGHLIGHTS ─────────────────────────────────────────────
	let highlightedFilename = $derived.by(() => {
		if (index < 0) return '';

		const currentTs = timestampsCache.get(index);
		const currentFn = narration.content[index]?.filename;
		if (currentTs && currentFn) {
			const mTime = findFilenameMentionTime(currentTs, currentFn);
			if (mTime >= 0 && currentTime >= mTime) return currentFn;
		}

		for (let i = index - 1; i >= 0; i--) {
			const ts = timestampsCache.get(i);
			const fn = narration.content[i]?.filename;
			if (ts && fn) {
				const mTime = findFilenameMentionTime(ts, fn);
				if (mTime >= 0) return fn;
			}
		}
		return '';
	});

	let totalDuration = $derived(Array.from(clipDurations.values()).reduce((sum, d) => sum + d, 0));
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
		if (autoStart) pregenAll();

		audio = new Audio();
		audio.volume = volume / 100;

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
			for (const url of audioCache.values()) {
				URL.revokeObjectURL(url);
			}
		};
	});

	function b64ToBlobUrl(b64: string, mime = 'audio/wav'): string {
		const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
		return URL.createObjectURL(new Blob([bytes], { type: mime }));
	}

	async function pregenAll() {
		pregenStatus = 'loading';
		pregenProgress = 0;
		pregenTotal = narration.content.length;

		for (const url of audioCache.values()) {
			URL.revokeObjectURL(url);
		}
		audioCache.clear();
		timestampsCache.clear();
		clipDurations.clear();

		const promises = narration.content.map(async (item: any, i: number) => {
			const text = item.script_text;
			if (!text.trim()) {
				pregenProgress++;
				return;
			}

			try {
				const hash = `${id}-${i}`;
				const cached = await getCachedTTS(hash);

				if (cached) {
					audioCache.set(i, b64ToBlobUrl(cached.audio));
					timestampsCache.set(i, cached.timestamps);
					clipDurations.set(i, cached.duration);
				} else {
					const res = await fetch('/api/tts-kokoro', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ text, voice })
					});

					if (res.ok) {
						const payload = await res.json();
						audioCache.set(i, b64ToBlobUrl(payload.audio));
						if (payload.timestamps) timestampsCache.set(i, payload.timestamps);
						if (payload.duration != null) clipDurations.set(i, payload.duration);

						await saveTTS({
							hash,
							audio: payload.audio,
							timestamps: payload.timestamps,
							duration: payload.duration,
							text,
							voice
						});
					}
				}
			} catch (err) {
				console.error(`[TTS pregen] Exception step ${i}:`, err);
			}
			pregenProgress++;
		});

		await Promise.all(promises);
		pregenStatus = audioCache.size > 0 ? 'done' : 'error';
	}

	$effect(() => {
		if (audio) audio.volume = volume / 100;
	});

	function playCurrentAudio() {
		if (!audio) return;

		const cachedUrl = audioCache.get(index);
		if (!cachedUrl) return;

		audio.pause();
		audio.src = cachedUrl;
		audio.currentTime = 0;
		currentTime = 0;

		audio.onended = () => {
			speaking = false;
			if (index < narration.content.length - 1) {
				index++;
				playCurrentAudio();
			} else {
				playbackComplete = true;
			}
		};

		audio.onerror = () => {
			speaking = false;
		};
		audio
			.play()
			.then(() => (speaking = true))
			.catch(() => (speaking = false));
	}

	const start = () => {
		if (pregenStatus !== 'done') {
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
			playbackComplete = false;
			audio?.pause();
			speaking = false;
			index--;
			if (audioCache.has(index)) playCurrentAudio();
		}
	};

	const handleNext = () => {
		if (index < narration.content.length - 1) {
			audio?.pause();
			speaking = false;
			index++;
			if (audioCache.has(index)) playCurrentAudio();
		} else {
			playbackComplete = true;
			speaking = false;
			audio?.pause();
		}
	};

	const handlePlay = () => {
		if (!audio) return;
		if (index === -1) {
			start();
			return;
		}

		if (speaking) {
			audio.pause();
			speaking = false;
		} else {
			if (playbackComplete) {
				handleRestart();
				return;
			}
			if (audioCache.has(index)) {
				const cachedUrl = audioCache.get(index)!;
				if (audio.src === cachedUrl || audio.src.startsWith(cachedUrl)) {
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

	const handleRestart = () => {
		playbackComplete = false;
		index = 0;
		playCurrentAudio();
	};

	function findFilenameMentionTime(timestamps: any[], filename: string): number {
		if (!timestamps?.length || !filename) return -1;
		const parts = filename.split('/');
		const basename = parts[parts.length - 1];
		const stem = basename.replace(/\.[^.]+$/, '');

		for (const ts of timestamps) {
			const cleanWord = ts.word.replace(/[.,;:!?"'()\[\]]/g, '');
			if (
				cleanWord.toLowerCase() === basename.toLowerCase() ||
				cleanWord.toLowerCase() === stem.toLowerCase()
			) {
				return ts.start - 1.8;
			}
		}
		for (const part of parts) {
			const partStem = part.replace(/\.[^.]+$/, '');
			for (const ts of timestamps) {
				const cleanWord = ts.word.replace(/[.,;:!?"'()\[\]]/g, '');
				if (cleanWord.toLowerCase() === partStem.toLowerCase() && partStem.length > 2) {
					return ts.start - 1.8;
				}
			}
		}
		return -1;
	}

	function findPhraseStartTime(timestamps: any[], phrase: string): number {
		if (!timestamps?.length || !phrase) return 0;
		const normalizedPhrase = phrase
			.toLowerCase()
			.replace(/[.,;:!?"'()\[\]]/g, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (!normalizedPhrase) return 0;

		let concatenatedText = '';
		const charToStartMap: number[] = [];

		for (const ts of timestamps) {
			const cleanWord = ts.word.toLowerCase().replace(/[.,;:!?"'()\[\]]/g, '');
			if (!cleanWord) continue;
			concatenatedText += cleanWord + ' ';
			for (let j = 0; j <= cleanWord.length; j++) charToStartMap.push(ts.start);
		}

		concatenatedText = concatenatedText.trim();
		const matchIdx = concatenatedText.indexOf(normalizedPhrase);
		if (matchIdx !== -1 && matchIdx < charToStartMap.length) return charToStartMap[matchIdx];

		const words = normalizedPhrase.split(' ');
		if (words.length > 3) {
			const partialPhrase = words.slice(0, 3).join(' ');
			const partialMatchIdx = concatenatedText.indexOf(partialPhrase);
			if (partialMatchIdx !== -1 && partialMatchIdx < charToStartMap.length) {
				return charToStartMap[partialMatchIdx];
			}
		}
		return 0;
	}

	function formatTime(s: number): string {
		if (isNaN(s) || !isFinite(s)) return '0:00';
		const mins = Math.floor(s / 60);
		const secs = Math.floor(s % 60)
			.toString()
			.padStart(2, '0');
		return `${mins}:${secs}`;
	}
</script>

<main bind:this={stageEl} class="flex flex-1 flex-col justify-center bg-agent-raised p-5">
	<!-- Stage Container: Locked height, no scroll -->
	<div
		class="relative mx-auto flex h-[700px] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-agent-border bg-agent-stage shadow-xl"
	>
		<div class="relative grid flex-1 grid-cols-2 overflow-hidden">
			{#if currentView}
				<!-- LEFT COLUMN: Info & Subtitles (Vertically Centered) -->
				<div class="relative z-10 flex h-full flex-col justify-center px-12 pr-6">
					<!-- Wrapper keeps Title and Subtitles together as a centered block -->
					<div class="flex flex-col">
						<div class="relative grid">
							{#key index}
								<div
									class="col-start-1 row-start-1 flex flex-col"
									in:fly={{ x: -20, duration: 400, delay: 150 }}
									out:fade={{ duration: 200 }}
								>
									<h2
										class="mb-3 text-3xl leading-tight font-bold tracking-tight text-agent-bright"
									>
										{currentView.title}
									</h2>
									{#if currentView.filename}
										<h3 class="flex items-center gap-2 font-mono text-lg text-agent">
											<span class="text-sm opacity-60">File:</span>
											{currentView.filename}
										</h3>
									{/if}
								</div>
							{/key}
						</div>

						<!-- Subtitles Engine -->
						<!-- <div class="mt-12 min-h-[120px] text-left text-lg leading-relaxed">
							...
						</div> -->
					</div>
				</div>

				<!-- RIGHT COLUMN: Current Active Component -->
				<div class="relative z-0 flex h-full items-center justify-center p-8 pl-6">
					{#key index}
						<div
							class="absolute inset-8"
							in:fly={{ y: 20, duration: 500, delay: 250 }}
							out:fade={{ duration: 250 }}
						>
							{#if currentStepIsVisible}
								<div
									class="flex h-full w-full items-center justify-center overflow-hidden"
									in:fade={{ duration: 300 }}
									out:fade={{ duration: 200 }}
								>
									{#if currentView.visual === 'folder tree viewer'}
										<Tree filetree={narration.filetree} currentFilename={highlightedFilename} />
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
							{/if}
						</div>
					{/key}
				</div>
			{:else}
				<div
					class="absolute inset-0 z-20 flex h-full flex-col bg-agent-stage"
					in:fade={{ delay: 300, duration: 400 }}
					out:fade={{ duration: 300 }}
				>
					<EmptyState {start} {pregenStatus} {pregenProgress} {pregenTotal} />
				</div>
			{/if}
		</div>

		<!-- FOOTER: Progress & Controls -->
		<div
			class="relative z-20 shrink-0 border-t border-agent-border bg-agent-stage/80 backdrop-blur-sm"
		>
			<!-- Progress bar -->
			<div class="relative h-[3px] w-full bg-agent-border/30">
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

			<!-- Media Controls -->
			<div class="flex h-16 w-full items-center justify-start gap-6 px-6">
				<span class="mr-4 w-24 font-mono text-sm text-agent-dim">
					{formatTime(globalElapsed)} / {formatTime(totalDuration)}
				</span>

				<SkipBack
					class="stroke-1.5 size-4 cursor-pointer transition-colors hover:text-agent"
					onclick={handleBack}
				/>

				<button
					onclick={handlePlay}
					class="flex items-center justify-center transition-transform hover:scale-110"
				>
					{#if speaking}
						<Pause
							class="stroke-1.5 size-5 cursor-pointer fill-agent text-agent drop-shadow-[0_0_8px_rgba(0,212,170,0.5)]"
						/>
					{:else if playbackComplete}
						<RotateCcw
							onclick={handleRestart}
							class="stroke-1.5 size-5 cursor-pointer transition-colors hover:text-agent"
						/>
					{:else}
						<Play class="stroke-1.5 size-5 cursor-pointer transition-colors hover:text-agent" />
					{/if}
				</button>

				<SkipForward
					class="stroke-1.5 size-4 cursor-pointer transition-colors hover:text-agent"
					onclick={handleNext}
				/>

				{#if !playbackComplete}
					<RotateCcw
						onclick={handleRestart}
						class="stroke-1.5 ml-2 size-4 cursor-pointer transition-colors hover:text-agent"
					/>
				{/if}

				<div class="ml-auto flex items-center">
					<Slider
						type="single"
						value={volume}
						onValueChange={(v) => {
							volume = Array.isArray(v) ? v[0] : v;
						}}
						max={100}
						step={1}
						class="w-32"
					/>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:global([data-slot='slider-track']) {
		background-color: var(--color-agent-border);
		height: 4px;
	}

	:global([data-slot='slider-range']) {
		background-color: var(--color-agent);
		height: 4px;
	}
</style>
