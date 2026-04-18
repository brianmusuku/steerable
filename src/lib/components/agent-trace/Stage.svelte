<script lang="ts">
	import ActionHeader from './ActionHeader.svelte';
	import FileView from './FileView.svelte';
	import DiffView from './DiffView.svelte';
	import TerminalBlock from './TerminalBlock.svelte';
	import EmptyState from './EmptyState.svelte';
	import { Play, Pause, SkipBack, SkipForward, Loader, RotateCcw } from '@lucide/svelte';
	import { Slider } from '$lib/components/ui/slider/';
	import Tree from './Tree.svelte';
	import { narration } from '$lib/data/llm_output3';
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import { getCachedTTS, saveTTS } from '$lib/utils/ttsCache';

	let stageEl: HTMLElement | undefined;
	let volume = $state(40);
	let currentTime = $state(0);
	let { index = $bindable(-1) } = $props();
	let currentView = $derived(narration.content[index]);
	let speaking = $state(false);
	let fileTreeActive = $state(false);
	let showContent = $state(false);
	let voice = $state('am_echo');
	let canvasEl = $state<HTMLElement>();
	let playbackComplete = $state(false);

	let visibleComponents = $derived.by(() => {
		if (index < 0) return [];
		const items: { component: any; props: any; id: string }[] = [];
		let treeAdded = false;

		const pushTree = () => {
			if (!treeAdded) {
				items.push({
					component: Tree,
					props: {
						filetree: currentView.filetree,
						currentFilename: highlightedFilename,
						onTreeMount: () => (fileTreeActive = true)
					},
					id: 'persistent-tree'
				});
				treeAdded = true;
			}
		};

		for (let i = 0; i <= index; i++) {
			const item = narration.content[i];
			if (!item) continue;

			let shouldShow = true;
			if (i === index) {
				const phrase = item.script_text_3word_phrase_where_visual_starts;
				const timestamps = timestampsCache.get(i);
				if (phrase && timestamps) {
					const startTime = findPhraseStartTime(timestamps, phrase);
					// Show component slightly before the phrase is spoken to account for animation
					if (currentTime < startTime - 1.8) {
						shouldShow = false;
					}
				}
			}

			if (shouldShow) {
				if (item.visual === 'folder tree viewer') {
					pushTree();
				} else if (item.visual === 'command line shell') {
					items.push({
						component: TerminalBlock,
						props: { content: item.agents_output },
						id: `step-${i}`
					});
				} else if (item.visual === 'file viewer') {
					items.push({
						component: FileView,
						props: { content: { lines: item.agents_output, filename: item.filename } },
						id: `step-${i}`
					});
				} else if (item.visual === 'code diff') {
					items.push({
						component: DiffView,
						props: { content: item.agents_output, filename: item.filename },
						id: `step-${i}`
					});
				}
			}
		}

		if (fileTreeActive && !treeAdded) {
			pushTree();
		}

		return items;
	});

	$effect(() => {
		// Run whenever index or visible components change
		if (index >= 0 && canvasEl && visibleComponents) {
			// A short timeout ensures the DOM has updated and the new row is being rendered
			setTimeout(() => {
				canvasEl?.scrollTo({ top: canvasEl.scrollHeight, behavior: 'smooth' });
			}, 100);
		}
	});

	// ── Filename highlight timing ───────────────────────────────────────
	// Computed filename to highlight in the Tree. Searches backwards to find moving mention.
	let highlightedFilename = $derived.by(() => {
		if (index < 0) return '';

		// 1. Check current clip up to the current playback time
		const currentTs = timestampsCache.get(index);
		const currentFn = narration.content[index]?.filename;
		if (currentTs && currentFn) {
			const mTime = findFilenameMentionTime(currentTs, currentFn);
			if (mTime >= 0 && currentTime >= mTime) {
				return currentFn;
			}
		}

		// 2. If no mention yet in current clip, look backwards through previous clips
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

	/** Browser-compatible hash function */
	async function getHash(text: string, voice: string): Promise<string> {
		const msgUint8 = new TextEncoder().encode(`${voice}:${text}`);
		const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
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
				const hash = await getHash(text, voice);
				const cached = await getCachedTTS(hash);

				if (cached) {
					console.log(`[TTS Cache] Hit for step ${i}: ${hash}`);
					const blobUrl = b64ToBlobUrl(cached.audio);
					newAudioCache.set(i, blobUrl);
					newTimestampsCache.set(i, cached.timestamps);
					newDurations.set(i, cached.duration);
				} else {
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

						// Save to client-side IndexedDB
						await saveTTS({
							hash,
							audio: payload.audio,
							timestamps: payload.timestamps,
							duration: payload.duration,
							text,
							voice
						});
					} else {
						console.error(`[TTS pregen] Failed step ${i}:`, await res.text());
					}
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
			} else {
				playbackComplete = true;
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
			playbackComplete = false;
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

	const handleRestart = () => {
		playbackComplete = false;
		fileTreeActive = false;
		showContent = false;
		index = 0;
		playCurrentAudio();
	};

	// ── Time formatting ──────────────────────────────────────────────────
	/**
	 * Find the timestamp (start time in seconds) at which the narration mentions
	 * the given filename. Returns -1 if no mention is found.
	 * Handles filenames without extensions by matching the basename stem.
	 */
	function findFilenameMentionTime(
		timestamps: { word: string; start: number; end: number }[],
		filename: string
	): number {
		if (!timestamps?.length || !filename) return -1;

		// Extract the basename and the stem (without extension)
		const parts = filename.split('/');
		const basename = parts[parts.length - 1]; // e.g. "README.md"
		const stem = basename.replace(/\.[^.]+$/, ''); // e.g. "README"

		for (const ts of timestamps) {
			// Clean punctuation from the word for comparison
			const cleanWord = ts.word.replace(/[.,;:!?"'()\[\]]/g, '');

			if (
				cleanWord.toLowerCase() === basename.toLowerCase() ||
				cleanWord.toLowerCase() === stem.toLowerCase()
			) {
				return ts.start - 1.8;
			}
		}

		// Also check for path segments (e.g. "frontend/README" mentioned as separate words)
		// Try to find the last path segment match
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

	/**
	 * Find the start timestamp where the specific phrase begins.
	 */
	function findPhraseStartTime(
		timestamps: { word: string; start: number; end: number }[],
		phrase: string
	): number {
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

			for (let j = 0; j <= cleanWord.length; j++) {
				charToStartMap.push(ts.start);
			}
		}

		concatenatedText = concatenatedText.trim();
		const matchIdx = concatenatedText.indexOf(normalizedPhrase);
		if (matchIdx !== -1 && matchIdx < charToStartMap.length) {
			return charToStartMap[matchIdx];
		}

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

<main
	bind:this={stageEl}
	class="scrollbar-thin-md flex-1 justify-center overflow-x-hidden overflow-y-auto bg-agent-stage p-5"
>
	<div class="m-8 flex h-180 flex-col justify-between border border-gray-600">
		{#if currentView}
			{#key index}
				<ActionHeader {currentView} onComplete={() => (showContent = true)} />
			{/key}
			<div
				bind:this={canvasEl}
				class="canvas scrollbar-thin-md grid flex-1 grid-cols-2 content-start items-start gap-x-3 gap-y-3 overflow-y-auto p-8"
			>
				{#each visibleComponents as { component: VisualComp, props, id }, i (id)}
					<div
						transition:slide={{ axis: 'y', duration: 500 }}
						class="flex h-fit flex-col {i % 2 === 0 ? 'justify-self-end' : 'justify-self-start'}"
					>
						<div transition:fade={{ duration: 300 }}>
							<VisualComp {...props} />
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState {start} {pregenStatus} {pregenProgress} {pregenTotal} />
		{/if}

		<div>
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
					{:else if playbackComplete}
						<RotateCcw
							onclick={handleRestart}
							class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
						/>
					{:else}
						<Play class="stroke-1.5 size-4 cursor-pointer hover:text-agent" />
					{/if}
				</button>
				<SkipForward
					class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
					onclick={handleNext}
				/>
				{#if !playbackComplete}
					<RotateCcw
						onclick={handleRestart}
						class="stroke-1.5 size-4 cursor-pointer hover:text-agent"
					/>
				{/if}

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
