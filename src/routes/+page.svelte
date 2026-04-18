<script lang="ts">
	import { Bot, Play, ChevronRight, Check } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const steps = [
		{
			num: '01',
			icon: '📋',
			title: 'Paste your trace',
			desc: 'Drop in any reasoning trace — from Claude, GPT-o1, DeepSeek, Gemini, or your own custom LLM output. We parse the structure automatically.',
			tag: 'Text input'
		},
		{
			num: '02',
			icon: '⚙',
			title: 'We render it',
			desc: 'Our pipeline segments the trace into scenes, generates narration, adds visual code overlays, and applies motion to highlight pivots and key insights.',
			tag: '~30 seconds'
		},
		{
			num: '03',
			icon: '▶',
			title: 'Share the video',
			desc: 'Download as MP4, share a hosted link, or embed on your blog. Perfect for research walkthroughs, teaching, or showing clients how your AI thinks.',
			tag: 'MP4 · WebM · GIF'
		}
	];

	const features = [
		{
			icon: '🌿',
			title: 'Branching detection',
			desc: 'Automatically identifies when the model considers alternatives, and visualizes the decision tree with animated branching paths.'
		},
		{
			icon: '🔁',
			title: 'Backtrack highlighting',
			desc: 'Spots "wait, actually…" moments and renders them with visual contrast — showing where the model self-corrected mid-thought.'
		},
		{
			icon: '🗣',
			title: 'AI voiceover narration',
			desc: 'Generate a clean, expressive narration track that summarizes each reasoning step in plain language, synced to the visuals.'
		},
		{
			icon: '🎨',
			title: 'Custom themes & branding',
			desc: 'Apply your brand colors, fonts, and logos. Ship reasoning videos that look like they belong in your product, not a demo.'
		}
	];
</script>

<svelte:head>
	<title>Steerable | Reasoning, Rendered</title>
	<meta
		name="description"
		content="Turn raw AI agent traces into cinematic, explainable videos. Show your stakeholders and users exactly how your agents think and act."
	/>
</svelte:head>

<div class="grain-overlay pointer-events-none fixed inset-0 z-[999] opacity-40 mix-blend-overlay"></div>

<div class="min-h-screen bg-[#0b0b10] font-sans text-[#f5f0e8] selection:bg-agent/30 selection:text-agent">
	<!-- NAV -->
	<nav class="fixed top-0 right-0 left-0 z-[100] flex items-center justify-between border-b border-white/5 bg-[#0b0b10]/85 px-12 py-5 backdrop-blur-xl">
		<div class="font-serif text-[1.3rem] tracking-tight text-[#f5f0e8]">
			steerable<span class="text-agent">.</span>ai
		</div>
		<ul class="hidden gap-10 text-[0.8rem] font-medium tracking-[0.12em] uppercase text-[#9490a4] md:flex">
			<li><a href="#how" class="transition-colors hover:text-[#f5f0e8]">How it works</a></li>
			<li><a href="#features" class="transition-colors hover:text-[#f5f0e8]">Features</a></li>
			<li><a href="#pricing" class="transition-colors hover:text-[#f5f0e8]">Pricing</a></li>
			<li><a href="#docs" class="transition-colors hover:text-[#f5f0e8]">Docs</a></li>
		</ul>
		<button class="rounded-sm bg-agent px-6 py-2.5 text-[0.8rem] font-medium tracking-wide text-[#0b0b10] transition-all hover:bg-agent/90 hover:-translate-y-0.5">
			Get early access
		</button>
	</nav>

	<!-- HERO -->
	<section class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pt-32 pb-16">
		<div class="hero-bg-lines pointer-events-none absolute inset-0"></div>

		<!-- FILM STRIPS -->
		<div class="film-strip top-[80px] border-b border-agent/10">
			<div class="strip-track flex animate-slide-strip whitespace-nowrap">
				{#each Array(20) as _}
					<div class="mx-4 h-5 w-7 shrink-0 rounded-[3px] border border-white/10 bg-[#0b0b10]"></div>
				{/each}
			</div>
		</div>

		<div class="film-strip bottom-0 border-t border-agent/10">
			<div class="strip-track flex animate-slide-strip whitespace-nowrap">
				{#each Array(20) as _}
					<div class="mx-4 h-5 w-7 shrink-0 rounded-[3px] border border-white/10 bg-[#0b0b10]"></div>
				{/each}
			</div>
		</div>

		{#if mounted}
			<p in:fly={{ y: 20, duration: 800, delay: 200 }} class="mb-6 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-agent">
				// Reasoning → Video pipeline
			</p>

			<h1 in:fly={{ y: 20, duration: 800, delay: 350 }} class="max-w-[900px] text-center font-serif text-[3.5rem] leading-[1.05] tracking-[-0.03em] md:text-[6rem]">
				Turn chain-of-thought<br />into <em class="not-italic text-agent">cinematic</em> clarity
			</h1>

			<p in:fly={{ y: 20, duration: 800, delay: 500 }} class="mt-6 max-w-[520px] text-center text-base leading-relaxed text-[#9490a4]">
				Paste any AI reasoning trace. Get a structured, narrated video that makes every step of the thinking process visible and shareable.
			</p>

			<div in:fly={{ y: 20, duration: 800, delay: 650 }} class="mt-10 flex gap-4">
				<button class="rounded-sm bg-agent px-8 py-3.5 text-[0.9rem] font-medium text-[#0b0b10] transition-all hover:translate-y-[-2px] hover:bg-agent/90 hover:shadow-[0_8px_24px_rgba(0,212,170,0.25)]">
					Start rendering free
				</button>
				<button class="flex items-center gap-2 rounded-sm border border-white/15 bg-transparent px-8 py-3.5 text-[0.9rem] text-[#f5f0e8] transition-all hover:border-white/35 hover:bg-white/5">
					<div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current">
						<Play size={8} fill="currentColor" />
					</div>
					Watch demo
				</button>
			</div>

			<!-- DEMO PANEL -->
			<div in:fly={{ y: 20, duration: 800, delay: 800 }} class="mt-16 grid w-[min(900px,90vw)] grid-cols-1 items-center gap-4 md:grid-cols-[1fr_60px_1fr] md:gap-0">
				<!-- Trace input -->
				<div class="overflow-hidden rounded-lg border border-white/10 bg-[#13131c]">
					<div class="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-3.5 py-2.5">
						<div class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></div>
						<span class="ml-1.5 font-mono text-[0.65rem] tracking-widest text-[#6b6878]">reasoning_trace.txt</span>
					</div>
					<div class="relative h-[240px] px-5 py-5 font-mono text-[0.7rem] leading-[1.9] text-[#7a778e]">
						<div class="space-y-0.5">
							<p class="text-[#3a3850]">// steerable-agent-v1 · task: optimize auth</p>
							<p>&nbsp;</p>
							<p class="text-[#9893b0]">&lt;thinking&gt;</p>
							<p class="text-[#9893b0]">I need to secure this endpoint.</p>
							<p class="text-agent">Should I use JWT or Sessions?</p>
							<p class="text-[#9893b0]">JWT is stateless but harder to revoke.</p>
							<p>&nbsp;</p>
							<p class="text-[#4ecdc4]">Step 1: Check existing providers</p>
							<p class="text-[#9893b0]">  — firebase, auth0, clerk...</p>
							<p>&nbsp;</p>
							<p class="text-agent">Wait, let me backtrack.</p>
							<p class="text-[#3a3850]">Simple Lucia Auth might be best<span class="inline-block h-[13px] w-[7px] animate-pulse bg-agent align-middle"></span></p>
						</div>
						<div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#13131c] to-transparent"></div>
					</div>
				</div>

				<!-- Transform Arrow -->
				<div class="flex flex-col items-center gap-1 md:rotate-0 rotate-90">
					<div class="h-5 w-px bg-agent/30"></div>
					<div class="h-7 w-7 animate-spin rounded-full border-[1.5px] border-agent/30 border-t-agent"></div>
					<div class="h-5 w-px bg-agent/30"></div>
					<div class="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-agent/30"></div>
				</div>

				<!-- Video output -->
				<div class="overflow-hidden rounded-lg border border-white/10 bg-[#13131c]">
					<div class="flex items-center justify-between border-b border-white/10 bg-white/5 px-3.5 py-2.5">
						<div class="flex gap-1.5">
							<div class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></div>
						</div>
						<span class="font-mono text-[0.65rem] tracking-widest text-[#6b6878]">output.mp4</span>
						<span class="font-mono text-[0.6rem] tracking-widest text-[#4ecdc4]">● RENDERED</span>
					</div>
					<div class="relative flex h-[240px] items-center justify-center overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-br from-[#1a1624] via-[#0f0e18] to-[#181523]"></div>
						<div class="relative z-10 flex w-full gap-1.5 px-4">
							{#each ['PROBLEM', 'ANALYSIS', 'PIVOT'] as label, i}
								<div class="group relative flex-1 h-[160px] overflow-hidden rounded-sm border border-white/10 transition-transform hover:scale-103">
									<div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br {i === 0 ? 'from-[#1e1530] to-[#2a1a3e]' : i === 1 ? 'from-[#121e2a] to-[#1a2e1a]' : 'from-[#2a1810] to-[#1e1018]'}">
										<div class="flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-white/20 text-[11px] text-white/50 italic font-serif">S</div>
										<span class="text-center font-mono text-[0.5rem] leading-tight text-white/30 tracking-tight">SCENE 0{i+1}<br/>{label}</span>
									</div>
									<div class="absolute inset-x-0 bottom-0 h-0.5 {i === 0 ? 'bg-[#7c5cbf]' : i === 1 ? 'bg-[#4ecdc4]' : 'bg-agent'}"></div>
								</div>
							{/each}
						</div>
						<button class="relative z-20 flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-agent/50 bg-agent/15 backdrop-blur-sm transition-all hover:scale-110 hover:bg-agent/25">
							<div class="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-agent/90"></div>
						</button>
						<span class="absolute bottom-2.5 right-3 font-mono text-[0.6rem] tracking-widest text-white/30">00:42:15:10</span>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- MARQUEE -->
	<div class="relative border-y border-white/5 bg-[#1a1924] py-4 overflow-hidden">
		<div class="flex w-max animate-marquee gap-12">
			{#each Array(2) as _}
				<div class="flex gap-12">
					{#each ['Chain-of-Thought', 'OpenAI o1 traces', 'Claude thinking blocks', 'Gemini reasoning', 'DeepSeek R1', 'Any LLM output', 'Step-by-step breakdowns', 'Multi-turn reasoning'] as item}
						<span class="flex items-center gap-3 whitespace-nowrap font-mono text-[0.7rem] font-medium tracking-[0.12em] uppercase text-[#6b6878]">
							<span class="h-1 w-1 rounded-full bg-agent/40"></span>
							{item}
						</span>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- HOW IT WORKS -->
	<section id="how" class="mx-auto max-w-[1100px] px-8 py-24">
		<p class="mb-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-agent">// Process</p>
		<h2 class="max-w-[600px] font-serif text-[2.5rem] leading-[1.1] tracking-tight md:text-[3.2rem]">
			Three steps from<br /><em class="not-italic text-agent">trace to screen</em>
		</h2>
		<p class="mt-6 max-w-[480px] text-[0.95rem] leading-relaxed text-[#9490a4]">
			No video editing knowledge needed. Paste your trace and we handle the rest — parsing, narration, animation, and export.
		</p>

		<div class="mt-16 grid grid-cols-1 overflow-hidden rounded-lg border border-white/5 bg-white/5 md:grid-cols-3 gap-[1px]">
			{#each steps as step}
				<div class="group relative bg-[#13131c] px-8 py-10 transition-colors hover:bg-[#1c1c2a]">
					<div class="mb-6 font-serif text-[3.5rem] leading-none tracking-[-0.04em] text-agent/10 transition-colors group-hover:text-agent/15 select-none">
						{step.num}
					</div>
					<div class="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-agent/20 bg-agent/5 text-lg">
						{step.icon}
					</div>
					<h3 class="mb-3 font-serif text-xl tracking-tight text-[#f5f0e8]">{step.title}</h3>
					<p class="text-[0.85rem] leading-relaxed text-[#9490a4]">{step.desc}</p>
					<span class="mt-5 inline-block rounded-sm bg-agent/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.1em] uppercase text-agent">
						{step.tag}
					</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- FEATURES -->
	<section id="features" class="mx-auto max-w-[1100px] px-8 py-24 pt-8">
		<div class="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
			<div>
				<p class="mb-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-agent">// Capabilities</p>
				<h2 class="max-w-[600px] font-serif text-[2.5rem] leading-[1.1] tracking-tight md:text-[3.2rem]">
					Built for<br /><em class="not-italic text-agent">deep traces</em>
				</h2>
				<p class="mt-6 max-w-[480px] text-[0.95rem] leading-relaxed text-[#9490a4]">
					Not just a transcript reader. Steerable understands reasoning structure — backtracks, hypotheses, pivots — and makes them visually meaningful.
				</p>

				<div class="mt-10 space-y-6">
					{#each features as feat}
						<div class="flex gap-4 rounded-md border border-white/5 p-5 transition-all hover:border-agent/20 hover:bg-agent/5">
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-agent/20 bg-agent/5 text-[0.95rem]">
								{feat.icon}
							</div>
							<div>
								<h4 class="mb-1 text-[0.9rem] font-medium text-[#f5f0e8]">{feat.title}</h4>
								<p class="text-[0.8rem] leading-relaxed text-[#6b6878]">{feat.desc}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Visual mock -->
			<div class="flex aspect-[4/5] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#13131c]">
				<div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
					<span class="font-mono text-[0.65rem] tracking-wider text-[#6b6878]">render_timeline.json</span>
					<span class="rounded-[2px] bg-[#4ecdc4]/10 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-[#4ecdc4]">● PROCESSING</span>
				</div>
				<div class="flex-1 space-y-6 p-6 overflow-hidden">
					{#each [
						{ time: '00:00', label: 'Problem framing', desc: 'Model defines the constraint space', color: 'bg-agent shadow-[0_0_6px_rgba(0,212,170,0.4)]', width: '78%' },
						{ time: '00:38', label: 'Graph modeling', desc: 'Nodes and edges animated', color: 'bg-[#4ecdc4] shadow-[0_0_6px_rgba(78,205,196,0.3)]', width: '45%' },
						{ time: '01:04', label: 'Backtrack detected', desc: '"Wait, this won\'t handle multi-commodity…"', color: 'bg-[#3a3850]', width: '30%' },
						{ time: '01:22', label: 'LP relaxation pivot', desc: 'Key insight highlighted and animated', color: 'bg-[#a78bfa] shadow-[0_0_6px_rgba(167,139,250,0.3)]', width: '91%' }
					] as item}
						<div class="flex gap-4">
							<div class="w-14 shrink-0 pt-1 text-right font-mono text-[0.6rem] text-[#6b6878]">{item.time}</div>
							<div class="mt-1.5 h-2 w-2 shrink-0 rounded-full {item.color}"></div>
							<div class="flex-1">
								<strong class="block text-[0.75rem] font-medium text-[#f5f0e8]">{item.label}</strong>
								<p class="text-[0.7rem] text-[#6b6878]">{item.desc}</p>
								<div class="mt-1.5 h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
									<div class="h-full rounded-full {item.color.split(' ')[0]}" style="width: {item.width}"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="flex gap-2 border-t border-white/5 p-4 py-3">
					{#each ['MP4', 'WebM', 'GIF'] as ext}
						<button class="flex-1 rounded-[4px] border border-white/10 bg-white/5 py-1.5 text-center font-mono text-[0.6rem] text-[#9490a4] hover:bg-white/10">{ext}</button>
					{/each}
					<button class="flex-1 rounded-[4px] border border-agent/25 bg-agent/10 py-1.5 text-center font-mono text-[0.6rem] font-bold text-agent tracking-tight">↓ EXPORT</button>
				</div>
			</div>
		</div>
	</section>

	<!-- PRICING -->
	<section id="pricing" class="mx-auto max-w-[1100px] px-8 py-24 pt-8">
		<p class="mb-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-agent">// Pricing</p>
		<h2 class="max-w-[600px] font-serif text-[2.5rem] leading-[1.1] tracking-tight md:text-[3.2rem]">
			Simple plans,<br /><em class="not-italic text-agent">no surprises</em>
		</h2>

		<div class="mt-16 grid grid-cols-1 overflow-hidden rounded-xl border border-white/5 bg-white/5 md:grid-cols-3 gap-[1px]">
			<!-- Free -->
			<div class="bg-[#13131c] p-10 transition-colors hover:bg-[#1c1c2a]">
				<span class="mb-6 inline-block rounded-[2px] bg-agent/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] uppercase text-agent">Free</span>
				<div class="mb-2 font-serif text-2xl tracking-tight text-[#f5f0e8]">Explorer</div>
				<p class="mb-8 text-[0.8rem] leading-relaxed text-[#6b6878]">For researchers and tinkerers trying it out.</p>
				<div class="mb-8 flex items-baseline gap-1">
					<span class="text-base font-medium text-[#9490a4]">$</span>
					<span class="font-serif text-[3rem] leading-none tracking-[-0.04em] text-[#f5f0e8]">0</span>
					<span class="text-[0.75rem] text-[#6b6878]">/mo</span>
				</div>
				<div class="mb-6 h-px bg-white/5"></div>
				<ul class="mb-8 space-y-3">
					{#each ['5 renders per month', 'Up to 2,000 token traces', '720p MP4 export', 'Steerable watermark'] as item}
						<li class="flex items-center gap-2.5 text-[0.8rem] text-[#9490a4]">
							<div class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4ecdc4]/15 text-[9px] text-[#4ecdc4]"><Check size={8} /></div>
							{item}
						</li>
					{/each}
					<li class="flex items-center gap-2.5 text-[0.8rem] text-[#6b6878]">
						<div class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/5 text-[9px] text-[#6b6878]">—</div>
						Custom branding
					</li>
				</ul>
				<button class="w-full rounded-sm border border-white/10 bg-transparent py-3 text-[0.85rem] transition-all hover:border-white/30 hover:bg-white/5">Start free</button>
			</div>

			<!-- Pro -->
			<div class="relative bg-[#1c1c2a] p-10 outline-1 -outline-offset-1 outline-agent/25">
				<span class="mb-6 inline-block rounded-[2px] bg-agent/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] uppercase text-agent">Most popular</span>
				<div class="mb-2 font-serif text-2xl tracking-tight text-[#f5f0e8]">Studio</div>
				<p class="mb-8 text-[0.8rem] leading-relaxed text-[#6b6878]">For teams shipping AI products who want to explain their models.</p>
				<div class="mb-8 flex items-baseline gap-1">
					<span class="text-base font-medium text-[#9490a4]">$</span>
					<span class="font-serif text-[3rem] leading-none tracking-[-0.04em] text-[#f5f0e8]">49</span>
					<span class="text-[0.75rem] text-[#6b6878]">/mo</span>
				</div>
				<div class="mb-6 h-px bg-white/5"></div>
				<ul class="mb-8 space-y-3">
					{#each ['100 renders per month', 'Up to 32k token traces', '1080p MP4 + WebM export', 'AI narration (10 voices)', 'Custom colors & logo', 'API access'] as item}
						<li class="flex items-center gap-2.5 text-[0.8rem] text-[#9490a4]">
							<div class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4ecdc4]/15 text-[9px] text-[#4ecdc4]"><Check size={8} /></div>
							{item}
						</li>
					{/each}
				</ul>
				<button class="w-full rounded-sm bg-agent py-3 text-[0.85rem] font-medium text-[#0b0b10] transition-all hover:bg-agent/90 hover:-translate-y-0.5">Get Studio</button>
			</div>

			<!-- Enterprise -->
			<div class="bg-[#13131c] p-10 transition-colors hover:bg-[#1c1c2a]">
				<span class="mb-6 inline-block rounded-[2px] bg-agent/10 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.15em] uppercase text-agent">Enterprise</span>
				<div class="mb-2 font-serif text-2xl tracking-tight text-[#f5f0e8]">Reel</div>
				<p class="mb-8 text-[0.8rem] leading-relaxed text-[#6b6878]">For labs with high-volume trace rendering needs.</p>
				<div class="mb-8">
					<span class="font-serif text-[2.5rem] leading-tight text-[#f5f0e8]">Custom</span>
				</div>
				<div class="mb-6 h-px bg-white/5"></div>
				<ul class="mb-8 space-y-3">
					{#each ['Unlimited renders', 'Unlimited trace length', '4K export + assets', 'Custom narrator cloning', 'White-label deployment'] as item}
						<li class="flex items-center gap-2.5 text-[0.8rem] text-[#9490a4]">
							<div class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#4ecdc4]/15 text-[9px] text-[#4ecdc4]"><Check size={8} /></div>
							{item}
						</li>
					{/each}
				</ul>
				<button class="w-full rounded-sm border border-white/10 bg-transparent py-3 text-[0.85rem] transition-all hover:border-white/30 hover:bg-white/5">Contact sales</button>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="relative overflow-hidden border-t border-white/5 px-8 py-40 text-center">
		<div class="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(0,212,170,0.06)_0%,transparent_70%)]"></div>
		<p class="mb-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-agent">// Get started today</p>
		<h2 class="mx-auto mb-6 max-w-[700px] font-serif text-[3.5rem] leading-[1.05] tracking-tight text-[#f5f0e8]">
			Your model thinks.<br />Let the world <em class="not-italic text-agent">see</em> it.
		</h2>
		<p class="mx-auto mb-12 max-w-[500px] text-center text-base leading-relaxed text-[#9490a4]">
			Steerable is in early access. Join 800+ researchers, AI engineers, and educators already rendering reasoning into watchable stories.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button class="rounded-sm bg-agent px-10 py-4 text-base font-bold text-[#0b0b10] transition-all hover:bg-agent/90 hover:shadow-[0_8px_24px_rgba(0,212,170,0.3)]">
				Get early access — free
			</button>
			<button class="flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-transparent px-10 py-4 text-base text-[#f5f0e8] hover:border-white/35 hover:bg-white/5">
				Read the docs
			</button>
		</div>
		<p class="mt-6 font-mono text-[0.65rem] tracking-widest text-[#6b6878]">
			No credit card · Renders in under 30s · Works with any LLM
		</p>
	</section>

	<!-- FOOTER -->
	<footer class="flex flex-col items-center justify-between gap-8 border-t border-white/5 px-12 py-8 md:flex-row">
		<div class="font-serif text-lg text-[#9490a4]">steerable<span class="text-agent/50">.</span>ai</div>
		<p class="text-[0.75rem] text-[#6b6878]">© 2025 Steerable. All rights reserved.</p>
		<ul class="flex gap-8 text-[0.75rem] text-[#6b6878]">
			<li><a href="#" class="transition-colors hover:text-[#9490a4]">Privacy</a></li>
			<li><a href="#" class="transition-colors hover:text-[#9490a4]">Terms</a></li>
			<li><a href="#" class="transition-colors hover:text-[#9490a4]">GitHub</a></li>
			<li><a href="#" class="transition-colors hover:text-[#9490a4]">Twitter</a></li>
		</ul>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.grain-overlay {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
		background-size: 200px 200px;
	}

	.hero-bg-lines {
		background-image: linear-gradient(rgba(0, 212, 170, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 212, 170, 0.04) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent);
	}

	.film-strip {
		position: absolute;
		left: 0;
		right: 0;
		height: 48px;
		background: #1a1924;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	@keyframes slideStrip {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-240px);
		}
	}

	.animate-slide-strip {
		animation: slideStrip 8s linear infinite;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	.animate-marquee {
		animation: marquee 30s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1.4s linear infinite;
	}
</style>
