<script lang="ts">
	import { ArrowRight, Bot, Cpu, Layers, Terminal, Waves } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const features = [
		{
			icon: Bot,
			title: 'Real-time Trace Narratives',
			description: 'Understand every step your AI takes with live TTS-powered narrations of agent thoughts.'
		},
		{
			icon: Layers,
			title: 'Multi-modal Observability',
			description: 'Visual stages including file trees, diff views, and terminal outputs all in one unified interface.'
		},
		{
			icon: Cpu,
			title: 'Steerable Control',
			description: 'Dynamic intervention points allow you to guide agents when they reach critical decision boundaries.'
		}
	];

	const stats = [
		{ label: 'Latency', value: '< 200ms' },
		{ label: 'Integrations', value: '10+' },
		{ label: 'Precision', value: '99.9%' }
	];
</script>

<svelte:head>
	<title>Steerable | Precision AI Observability</title>
	<meta
		name="description"
		content="The high-fidelity trace explorer for AI agents. Understand, debug, and steer your autonomous agents with real-time visual narratives."
	/>
</svelte:head>

<div class="dark min-h-screen bg-agent-stage font-sans text-agent-default selection:bg-agent/30 selection:text-agent">
	<!-- Navbar -->
	<nav class="fixed top-0 z-50 w-full border-b border-agent-border/40 bg-agent-stage/80 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-agent text-agent-stage">
					<Bot size={20} weight="bold" />
				</div>
				<span class="text-xl font-bold tracking-tight text-agent-bright">Steerable</span>
			</div>
			
			<div class="hidden items-center gap-8 md:flex">
				<a href="#features" class="text-sm font-medium transition-colors hover:text-agent">Features</a>
				<a href="#showcase" class="text-sm font-medium transition-colors hover:text-agent">Showcase</a>
				<a href="#tech" class="text-sm font-medium transition-colors hover:text-agent">Tech Stack</a>
			</div>

			<div class="flex items-center gap-4">
				<a
					href="/app"
					class="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-agent px-5 py-2 text-sm font-semibold text-agent-stage transition-all hover:pr-6 active:scale-95"
				>
					<span>Open App</span>
					<ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</nav>

	<main>
		<!-- Hero Section -->
		<section class="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
			<!-- Background Glows -->
			<div class="absolute top-0 -left-20 -z-10 h-96 w-96 rounded-full bg-agent/10 blur-[120px]"></div>
			<div class="absolute top-1/2 -right-20 -z-10 h-96 w-96 rounded-full bg-agent-purple/10 blur-[120px]"></div>

			<div class="mx-auto max-w-7xl px-6">
				<div class="flex flex-col items-center text-center">
					<div
						class="mb-6 inline-flex items-center gap-2 rounded-full border border-agent-border bg-agent-surface/50 px-3 py-1 backdrop-blur-sm"
					>
						<span class="flex h-1.5 w-1.5 rounded-full bg-agent animate-pulse"></span>
						<span class="text-[11px] font-bold tracking-widest text-agent-subtle uppercase">v1.2 Out Now</span>
					</div>

					<h1 class="max-w-4xl text-5xl font-extrabold tracking-tight text-agent-bright md:text-7xl">
						Precision Observability for <span class="bg-gradient-to-r from-agent to-agent-blue bg-clip-text text-transparent">AI Agents</span>
					</h1>
					
					<p class="mt-8 max-w-2xl text-lg text-agent-subtle md:text-xl">
						The high-fidelity trace explorer for autonomous agents. Understand, debug, and steer your models with real-time visual narratives.
					</p>

					<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
						<a
							href="/app"
							class="flex h-12 items-center justify-center rounded-xl bg-agent px-8 text-base font-bold text-agent-stage transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] active:scale-95"
						>
							Start Exploring
						</a>
						<button
							class="flex h-12 items-center justify-center rounded-xl border border-agent-border bg-agent-surface px-8 text-base font-bold transition-all hover:bg-agent-raised active:scale-95"
						>
							View Documentation
						</button>
					</div>

					<!-- Visual Hero Element -->
					{#if mounted}
						<div
							in:fly={{ y: 40, duration: 1000, delay: 200 }}
							class="relative mt-20 w-full max-w-5xl overflow-hidden rounded-2xl border border-agent-border bg-agent-stage shadow-2xl"
						>
							<div class="flex h-8 items-center gap-1.5 border-b border-agent-border bg-agent-surface px-4">
								<div class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></div>
								<div class="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></div>
								<div class="ml-4 text-[10px] font-mono text-agent-dim">session · research-mode · trace.json</div>
							</div>
							<div class="grid grid-cols-12 overflow-hidden bg-agent-stage">
								<!-- Sidebar Placeholder -->
								<div class="col-span-3 border-r border-agent-border p-4">
									<div class="space-y-3">
										{#each Array(5) as _, i}
											<div class="flex items-center gap-2">
												<div class="h-2 w-2 rounded-full bg-agent/40"></div>
												<div class="h-2 flex-1 rounded-sm bg-agent-border" style="width: {Math.random() * 50 + 40}%"></div>
											</div>
										{/each}
									</div>
								</div>
								<!-- Main Workspace Placeholder -->
								<div class="col-span-9 p-8">
									<div class="space-y-6">
										<div class="h-4 w-1/3 rounded bg-agent-thought-border/50"></div>
										<div class="grid grid-cols-2 gap-4">
											<div class="aspect-video rounded-lg border border-agent-border bg-agent-surface flex items-center justify-center">
												<Terminal size={40} class="text-agent/20" />
											</div>
											<div class="aspect-video rounded-lg border border-agent-border bg-agent-surface flex items-center justify-center">
												<Layers size={40} class="text-agent/20" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- Overlay Glow -->
							<div class="absolute inset-0 bg-gradient-to-t from-agent-stage/80 via-transparent to-transparent"></div>
						</div>
					{/if}
				</div>
			</div>
		</section>

		<!-- Features Grid -->
		<section id="features" class="py-20 md:py-32 bg-agent-stage/50">
			<div class="mx-auto max-w-7xl px-6">
				<div class="mb-20 text-center">
					<h2 class="text-3xl font-bold text-agent-bright md:text-5xl">Built for high-stakes AI.</h2>
					<p class="mt-4 text-agent-subtle">Everything you need to move from black-box to transparent execution.</p>
				</div>
				
				<div class="grid gap-8 md:grid-cols-3">
					{#each features as feature, i}
						<div
							class="group relative overflow-hidden rounded-2xl border border-agent-border bg-agent-surface p-8 transition-all hover:border-agent/30 hover:bg-agent-raised"
						>
							<div class="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-agent/10 text-agent transition-transform group-hover:scale-110 group-hover:rotate-3">
								<feature.icon size={24} />
							</div>
							<h3 class="mb-3 text-xl font-bold text-agent-bright">{feature.title}</h3>
							<p class="text-agent-subtle leading-relaxed">{feature.description}</p>
							
							<div class="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-agent/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-0"></div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Stats Section -->
		<section class="border-y border-agent-border py-20 bg-agent-stage">
			<div class="mx-auto max-w-7xl px-6">
				<div class="grid grid-cols-2 gap-12 md:grid-cols-3">
					{#each stats as stat}
						<div class="text-center">
							<div class="text-4xl font-black text-agent md:text-6xl">{stat.value}</div>
							<div class="mt-2 text-sm font-bold tracking-widest text-agent-dim uppercase">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Tech Stack Section -->
		<section id="tech" class="py-20 md:py-32">
			<div class="mx-auto max-w-7xl px-6">
				<div class="flex flex-col items-center justify-between gap-12 lg:flex-row">
					<div class="max-w-xl">
						<h2 class="text-3xl font-bold text-agent-bright md:text-5xl">Modern stack, <br/>Extreme performance.</h2>
						<p class="mt-6 text-lg text-agent-subtle leading-relaxed">
							Steerable is built on top of the latest web technologies to ensure a zero-latency experience, even when processing massive agent traces.
						</p>
						<div class="mt-8 flex flex-wrap gap-3">
							<span class="rounded-full bg-agent-muted/50 border border-agent-border px-4 py-1.5 text-xs font-semibold text-agent">SvelteKit 5</span>
							<span class="rounded-full bg-agent-muted/50 border border-agent-border px-4 py-1.5 text-xs font-semibold text-agent">Cloudflare Workers</span>
							<span class="rounded-full bg-agent-muted/50 border border-agent-border px-4 py-1.5 text-xs font-semibold text-agent">Tailwind CSS</span>
							<span class="rounded-full bg-agent-muted/50 border border-agent-border px-4 py-1.5 text-xs font-semibold text-agent">Kokoro TTS</span>
						</div>
					</div>
					
					<div class="relative w-full max-w-md aspect-square">
						<!-- Tech visual (Abstract) -->
						<div class="absolute inset-0 rounded-3xl border border-agent-border bg-agent-surface p-8 flex items-center justify-center">
							<div class="grid grid-cols-3 gap-8">
								<div class="h-16 w-16 rounded-2xl bg-agent-stage flex items-center justify-center border border-agent-border shadow-inner animate-bounce" style="animation-delay: 0s">
									<Waves size={32} class="text-agent" />
								</div>
								<div class="h-16 w-16 rounded-2xl bg-agent-stage flex items-center justify-center border border-agent-border shadow-inner animate-bounce" style="animation-delay: 0.1s">
									<Terminal size={32} class="text-agent-purple" />
								</div>
								<div class="h-16 w-16 rounded-2xl bg-agent-stage flex items-center justify-center border border-agent-border shadow-inner animate-bounce" style="animation-delay: 0.2s">
									<Cpu size={32} class="text-agent-blue" />
								</div>
							</div>
						</div>
						<!-- Glow -->
						<div class="absolute -inset-4 -z-10 rounded-[4rem] bg-agent/5 blur-2xl"></div>
					</div>
				</div>
			</div>
		</section>

		<!-- Final CTA -->
		<section class="py-20 md:py-40">
			<div class="mx-auto max-w-4xl px-6 text-center">
				<div class="rounded-3xl border border-agent-border bg-gradient-to-b from-agent-surface to-agent-stage p-12 md:p-20 relative overflow-hidden">
					<div class="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-64 bg-gradient-to-r from-transparent via-agent to-transparent"></div>
					
					<h2 class="text-4xl font-bold text-agent-bright md:text-6xl">Ready to steer?</h2>
					<p class="mt-6 text-lg text-agent-subtle max-w-lg mx-auto">
						Join the world's most advanced AI engineering teams using Steerable to build reliable agentic systems.
					</p>
					
					<div class="mt-12">
						<a
							href="/app"
							class="inline-flex h-14 items-center justify-center rounded-2xl bg-agent px-12 text-lg font-bold text-agent-stage transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] active:scale-95"
						>
							Get Started for Free
						</a>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-agent-border py-12 bg-agent-stage">
		<div class="mx-auto max-w-7xl px-6">
			<div class="flex flex-col items-center justify-between gap-8 md:flex-row">
				<div class="flex items-center gap-2">
					<div class="flex h-6 w-6 items-center justify-center rounded bg-agent text-agent-stage">
						<Bot size={14} weight="bold" />
					</div>
					<span class="text-lg font-bold tracking-tight text-agent-bright">Steerable</span>
				</div>
				
				<div class="flex gap-8 text-sm text-agent-dim">
					<a href="#" class="transition-colors hover:text-agent">Privacy</a>
					<a href="#" class="transition-colors hover:text-agent">Terms</a>
					<a href="#" class="transition-colors hover:text-agent">Github</a>
					<a href="#" class="transition-colors hover:text-agent">Twitter</a>
				</div>
				
				<div class="text-sm text-agent-dim">
					&copy; {new Date().getFullYear()} Steerable AI. Built with Svelte.
				</div>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	
	/* Custom animations for the hero background */
	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
</style>
