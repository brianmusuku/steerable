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
	let speaking = $state(false);
	let fileTreeActive = $state(false);

	let text = $state('Hello! This is a test of the Kokoro TTS API running on Modal.');
	let voice = $state('af_heart');
	let endpointUrl = $state('https://findmjuaji--kokoro-api-pipeline-tts-api.modal.run');

	let status = $state('idle'); // idle | loading | success | error
	let errorMsg = $state('');
	let audioUrl = $state<string | null>(null);
	let audioDuration = $state<string | null>(null);

	const voices = [
		{ value: 'af_heart', label: 'af_heart (default)' },
		{ value: 'af_sky', label: 'af_sky' },
		{ value: 'af_bella', label: 'af_bella' },
		{ value: 'am_adam', label: 'am_adam' },
		{ value: 'am_michael', label: 'am_michael' },
		{ value: 'bf_emma', label: 'bf_emma (British)' },
		{ value: 'bm_george', label: 'bm_george (British)' }
	];

	async function generate() {
		if (!text.trim()) return;
		status = 'loading';
		errorMsg = '';
		audioUrl = null;
		audioDuration = null;

		try {
			const res = await fetch(endpointUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, voice })
			});

			if (!res.ok) {
				const msg = await res.text();
				throw new Error(`HTTP ${res.status}: ${msg}`);
			}

			const blob = await res.blob();
			audioUrl = URL.createObjectURL(blob);
			status = 'success';
		} catch (e: any) {
			errorMsg = e.message;
			status = 'error';
		}
	}

	function onAudioLoaded(e: any) {
		audioDuration = e.target.duration?.toFixed(2);
	}

	function reset() {
		if (audioUrl) URL.revokeObjectURL(audioUrl);
		audioUrl = null;
		status = 'idle';
		errorMsg = '';
		audioDuration = null;
	}
</script>

<main
	bind:this={stageEl}
	class="scrollbar-thin-md flex-1 justify-center overflow-x-hidden overflow-y-auto bg-agent-stage p-5"
>
	{#if status === 'success' && audioUrl}
		<section class="card result">
			<h2>✅ Audio Ready</h2>
			{#if audioDuration}
				<p class="meta">Duration: {audioDuration}s · Voice: <code>{voice}</code></p>
			{/if}

			<!-- svelte-ignore a11y_media_has_caption -->
			<audio controls autoplay src={audioUrl} onloadedmetadata={onAudioLoaded}></audio>

			<a href={audioUrl} download="kokoro_output.wav" class="download-btn"> ⬇ Download WAV </a>
		</section>
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
