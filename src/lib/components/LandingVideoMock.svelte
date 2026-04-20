<script lang="ts">
	import { onMount } from 'svelte';
	import { Play, Pause, SkipBack, SkipForward, Maximize2, Volume2 } from 'lucide-svelte';
	import { fade, slide, scale } from 'svelte/transition';

	let { active = false } = $props();

	let progress = $state(0);
	let playing = $state(false);

	onMount(() => {
		if (active) {
			playing = true;
		}
	});

	$effect(() => {
		if (active && playing) {
			const interval = setInterval(() => {
				progress = (progress + 0.5) % 100;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	const segments = [
		{ title: 'Parsing logic', status: 'done', width: '20%' },
		{ title: 'Backtrack detected', status: 'active', width: '35%' },
		{ title: 'Pivot to LP relaxation', status: 'pending', width: '25%' },
		{ title: 'Solution synthesis', status: 'pending', width: '20%' }
	];
</script>

<div class="video-mock-container" class:active in:scale={{ duration: 600, start: 0.95, opacity: 0 }}>
	<!-- Header / Top Bar -->
	<div class="video-mock-header">
		<div class="flex items-center gap-3">
			<div class="h-2 w-2 rounded-full bg-[#00d4aa] shadow-[0_0_8px_rgba(0,212,170,0.6)]"></div>
			<span class="text-[10px] font-medium tracking-wider text-[#8b949e] uppercase">Live Rendering</span>
		</div>
		<div class="text-[10px] text-[#484f58]">01:04 / 02:45</div>
	</div>

	<!-- Main Content "Stage" -->
	<div class="video-mock-stage">
		<div class="grid grid-cols-2 gap-4 h-full p-6">
			<!-- Left Side: Trace -->
			<div class="flex flex-col gap-3">
				{#each segments as segment, i}
					<div 
						class="segment-card" 
						class:active={segment.status === 'active'}
						class:done={segment.status === 'done'}
						style="--delay: {i * 150}ms"
					>
						<div class="flex items-center justify-between mb-2">
							<span class="text-[10px] font-mono">{segment.title}</span>
							{#if segment.status === 'done'}
								<span class="text-[#00d4aa] text-[10px]">✓</span>
							{:else if segment.status === 'active'}
								<span class="loading-spinner"></span>
							{/if}
						</div>
						<div class="h-1 w-full bg-[#21262d] rounded-full overflow-hidden">
							<div 
								class="h-full bg-[#00d4aa] transition-all duration-1000" 
								style="width: {segment.status === 'done' ? '100%' : segment.status === 'active' ? '65%' : '0%'}"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Right Side: Visualization Mock -->
			<div class="relative flex items-center justify-center border border-[#21262d] rounded-md bg-[#0d1117] overflow-hidden group">
				<div class="absolute inset-0 bg-gradient-to-br from-[#00d4aa]/5 to-transparent"></div>
				
				<!-- Branching Diagram Mock -->
				<div class="branching-mock">
					<div class="node central"></div>
					<div class="line l1"></div>
					<div class="line l2"></div>
					<div class="node n1"></div>
					<div class="node n2 active"></div>
					<div class="pulse-ring"></div>
				</div>

				<div class="absolute bottom-3 left-3 flex flex-col gap-1">
					<div class="text-[9px] text-[#484f58] font-mono">confidence_score</div>
					<div class="text-[14px] text-[#00d4aa] font-mono font-bold tracking-tighter">0.942</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Controls Bar -->
	<div class="video-mock-controls">
		<div class="progress-bar-container">
			<div class="progress-bar-fill" style="width: {progress}%"></div>
			<div class="progress-bar-cursor" style="left: {progress}%"></div>
		</div>

		<div class="flex items-center justify-between px-4 py-3">
			<div class="flex items-center gap-5">
				<SkipBack size={14} class="text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer transition-colors" />
				<button onclick={() => playing = !playing} class="flex items-center justify-center">
					{#if playing}
						<Pause size={16} class="text-[#00d4aa] fill-[#00d4aa]/20" />
					{:else}
						<Play size={16} class="text-[#00d4aa] fill-[#00d4aa]/20" />
					{/if}
				</button>
				<SkipForward size={14} class="text-[#8b949e] hover:text-[#c9d1d9] cursor-pointer transition-colors" />
			</div>

			<div class="flex items-center gap-4">
				<Volume2 size={14} class="text-[#484f58]" />
				<Maximize2 size={14} class="text-[#484f58]" />
			</div>
		</div>
	</div>
</div>

<style>
	.video-mock-container {
		width: 100%;
		min-height: 380px;
		background: #0d1117;
		border: 1px solid #21262d;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 
			0 20px 50px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(0, 212, 170, 0.1);
	}

	.video-mock-header {
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		background: #161b22;
		border-bottom: 1px solid #21262d;
	}

	.video-mock-stage {
		flex: 1;
		background: #0a0e14;
		position: relative;
	}

	.segment-card {
		background: #161b22;
		border: 1px solid #21262d;
		border-radius: 4px;
		padding: 10px;
		opacity: 0;
		transform: translateY(10px);
		animation: segmentEntry 0.6s ease forwards;
		animation-delay: var(--delay);
	}

	.segment-card.active {
		border-color: rgba(0, 212, 170, 0.3);
		background: rgba(0, 212, 170, 0.03);
	}

	.segment-card.done {
		border-color: #21262d;
	}

	@keyframes segmentEntry {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.loading-spinner {
		width: 10px;
		height: 10px;
		border: 1px solid #00d4aa;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Branching Mock Icons/Shapes */
	.branching-mock {
		position: relative;
		width: 120px;
		height: 100px;
	}

	.node {
		position: absolute;
		width: 8px;
		height: 8px;
		background: #21262d;
		border-radius: 50%;
		z-index: 2;
	}

	.node.central { top: 50%; left: 10%; transform: translateY(-50%); background: #8b949e; }
	.node.n1 { top: 20%; left: 80%; }
	.node.n2 { bottom: 20%; left: 80%; }
	.node.active { background: #00d4aa; box-shadow: 0 0 10px #00d4aa; }

	.line {
		position: absolute;
		height: 1px;
		background: #21262d;
		transform-origin: left center;
		z-index: 1;
	}

	.line.l1 { width: 85px; top: 50%; left: 14%; transform: rotate(-22deg); }
	.line.l2 { width: 85px; top: 50%; left: 14%; transform: rotate(22deg); background: #00d4aa; opacity: 0.4; }

	.pulse-ring {
		position: absolute;
		bottom: 20%;
		left: 80%;
		width: 8px;
		height: 8px;
		border: 1px solid #00d4aa;
		border-radius: 50%;
		transform: translate(-0%, -0%);
		animation: pulse 2s ease-out infinite;
	}

	@keyframes pulse {
		0% { transform: scale(1); opacity: 0.8; }
		100% { transform: scale(4); opacity: 0; }
	}

	/* Controls */
	.video-mock-controls {
		background: #0d1117;
		border-top: 1px solid #21262d;
	}

	.progress-bar-container {
		height: 3px;
		background: #21262d;
		position: relative;
		cursor: pointer;
	}

	.progress-bar-fill {
		height: 100%;
		background: #00d4aa;
		transition: width 0.1s linear;
	}

	.progress-bar-cursor {
		position: absolute;
		top: 50%;
		width: 10px;
		height: 10px;
		background: #00d4aa;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 8px rgba(0, 212, 170, 0.8);
		pointer-events: none;
		transition: left 0.1s linear;
	}
</style>
