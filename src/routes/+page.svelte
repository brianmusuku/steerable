<script lang="ts">
	import { onMount } from 'svelte';
	import LandingVideoMock from '$lib/components/LandingVideoMock.svelte';
	import { fade, scale } from 'svelte/transition';

	let showVideo = $state(false);

	/* ── Smooth scroll ─────────────────────────────────────────────── */
	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	/* ── Intersection observer for reveal ──────────────────────────── */
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
					}
				});
			},
			{ threshold: 0.1 }
		);
		document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

		// Continuous loop between terminal and video
		function startLoop() {
			setTimeout(() => {
				if (!showVideo) {
					showVideo = true;
				}
			}, 4000); // Wait 4s in terminal
		}

		startLoop();

		return () => observer.disconnect();
	});

	function handleVideoFinish() {
		setTimeout(() => {
			showVideo = false;
			// Restart terminal sequence cycle
			setTimeout(() => {
				showVideo = true;
			}, 10000); // 10s in terminal before switching back
		}, 2000); // Wait 2s on "finished" screen
	}

	/* integrations */
	const integrations = [
		{ name: 'OpenCode', type: 'Launched' },
		{ name: 'Claude code', type: 'Coming soon' },
		{ name: 'Cursor', type: 'Coming soon' },
		{ name: 'Steerable', type: 'Coming soon' }
	];

	/* pricing */
	const plans = [
		{
			tag: 'Free',
			tagClass: 'text-agent-dim bg-[#1c1f28] border-agent-border',
			name: 'Explorer',
			desc: 'For researchers and tinkerers trying it out.',
			price: '0',
			period: '/mo',
			featured: false,
			feats: [
				{ text: '5 renders / month', on: true },
				{ text: 'Up to 2k token traces', on: true },
				{ text: 'AI subtitles', on: true },
				{ text: 'AI narration', on: false },
				{ text: 'Change video theme', on: false }
			],
			btnClass: 'landing-btn-ghost',
			btnText: 'start free'
		},
		{
			tag: 'Studio',
			tagClass: 'text-agent bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.2)]',
			name: 'Studio',
			desc: 'For teams shipping AI products and demos.',
			price: '49',
			period: '/lifetime',
			featured: true,
			feats: [
				{ text: '100 renders / month', on: true },
				{ text: 'Up to 32k token traces', on: true },
				{ text: 'AI narration (10 voices)', on: true },
				{ text: 'AI generated subtitles', on: true },
				{ text: 'Change video theme', on: true }
			],
			btnClass: 'landing-btn-solid',
			btnLink: 'https://brayanmusuku.gumroad.com/l/steerable',
			btnText: 'get studio'
		},
		{
			tag: 'Enterprise',
			tagClass: 'text-agent-subtle bg-[#1c1f28] border-agent-border',
			name: 'Reel',
			desc: 'For labs and enterprises with high-volume needs.',
			price: 'custom',
			period: '',
			featured: false,
			feats: [
				{ text: 'Unlimited renders', on: true },
				{ text: 'Unlimited trace length', on: true },
				{ text: '4K + raw asset export', on: true },
				{ text: 'Custom narrator cloning', on: true },
				{ text: 'White-label + SLA', on: true }
			],
			btnClass: 'landing-btn-ghost',
			btnText: 'contact sales'
		}
	];
</script>

<svelte:head>
	<title>Steerable — Generate AI Videos for your coding projects</title>
	<meta
		name="description"
		content="Turn any AI reasoning trace into a structured, narrated video — in under 30 seconds. Works with Claude, OpenAI o1, DeepSeek R1, Gemini and more."
	/>
</svelte:head>

<div class="dark landing-root">
	<!-- ═══════ TOP BAR ═══════ -->
	<header class="landing-topbar">
		<div class="landing-brand">STEERABLE</div>
		<div class="landing-path">
			<span class="text-agent-subtle">code changes</span>
			<span class="text-agent-dim">→</span>
			<span class="text-agent">explainable video</span>
		</div>
		<nav class="landing-nav">
			<button class="landing-nav-btn" onclick={() => scrollTo('how')}>how it works</button>
			<button class="landing-nav-btn" onclick={() => scrollTo('integrations')}>integrations</button>
			<button class="landing-nav-btn" onclick={() => scrollTo('pricing')}>pricing</button>
			<button class="landing-cta-btn">
				<a href="https://www.npmjs.com/package/steerable" target="_blank">docs</a>
			</button>
		</nav>
	</header>

	<!-- ═══════ HERO ═══════ -->
	<section class="landing-hero">
		<div class="hero-content">
			<div class="hero-eyebrow">
				<span class="hero-eyebrow-dot"></span>
				Now in early access
			</div>

			<!-- <h1 class="hero-title">
				Your AI agent codes,<br />
				We review its work via <em>videos</em>.
			</h1> -->
			<h1 class="hero-title">
				AI <em>videos</em> reviews <br />for your coding projects.
			</h1>

			<p class="hero-subtitle">
				Steerable is a command line tool that converts code diffs into narrated explainer videos.
				Automatically.
			</p>

			<div class="hero-actions">
				<button class="hero-btn-primary"> npm install -g steerable </button>
			</div>
		</div>

		<!-- Terminal / Video preview -->
		<div class="hero-preview-container">
			{#if !showVideo}
				<div class="hero-preview-stack" transition:fade={{ duration: 500 }}>
					<div class="hero-terminal">
						<div class="hero-term-bar">
							<div class="hero-term-dots">
								<span class="dot-red"></span>
								<span class="dot-yellow"></span>
								<span class="dot-green"></span>
							</div>
							<span class="hero-term-title">steerable</span>
						</div>
						<div class="hero-term-body">
							<span class="tl tl-teal"
								><span class="text-agent-blue">/Projects/myproject</span>$ steerable -review</span
							>
							<button
								class="tl tl-white text-left transition-all hover:underline"
								onclick={() => (showVideo = true)}
							>
								✓ Video is ready, watch is at https://steerable.io/watch/4*ay5c1F3
							</button>
						</div>
					</div>
				</div>
			{:else}
				<div class="hero-preview-stack" transition:fade={{ duration: 500 }}>
					<LandingVideoMock active={showVideo} onFinish={handleVideoFinish} />
					<button
						class="mx-auto mt-4 flex items-center gap-2 text-[11px] text-agent-dim transition-colors hover:text-agent-subtle"
						onclick={() => (showVideo = false)}
					>
						← Back to terminal
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- ═══════ HOW IT WORKS ═══════ -->
	<section id="how" class="landing-section border-t border-agent-border">
		<div class="landing-section-inner reveal-on-scroll">
			<div class="landing-eyebrow">process</div>
			<h2 class="landing-s-title">
				From trace to video<br />in <em>three steps</em>
			</h2>
			<p class="landing-s-sub">
				No editing software. No manual work. Paste your trace and Steerable handles parsing,
				narration, and rendering automatically.
			</p>

			<div class="landing-steps-row">
				<div class="landing-how-step">
					<div class="landing-hs-num">01</div>
					<div class="landing-hs-icon">📋</div>
					<div class="landing-hs-title">Install the plugin</div>
					<p class="landing-hs-desc">
						Install the steerable opencode plugin by following the instructions on
						<a href="https://www.npmjs.com/package/steerable" target="_blank">npm</a>. It basically
						entails adding a line to the opencode.json file.
					</p>
					<span class="landing-hs-tag">easy setup</span>
				</div>
				<div class="landing-how-step">
					<div class="landing-hs-num">02</div>
					<div class="landing-hs-icon">⚙</div>
					<div class="landing-hs-title">Ask it to generate</div>
					<p class="landing-hs-desc">
						Use your coding agent normally. If the session needs to be visualised, simply ask the
						LLM to use the steerable plugin to generate a video of the session.
					</p>
					<span class="landing-hs-tag">~28 seconds avg</span>
				</div>
				<div class="landing-how-step">
					<div class="landing-hs-num">03</div>
					<div class="landing-hs-icon">▶</div>
					<div class="landing-hs-title">Share the video</div>
					<p class="landing-hs-desc">
						The plugin will generate a link, which points to the hosted video. Anyone with the link
						can watch and share the video regardless of the agent they use.
					</p>
					<span class="landing-hs-tag">share anywhere</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ INTEGRATIONS ═══════ -->
	<section id="integrations" class="landing-section">
		<div class="landing-section-inner reveal-on-scroll">
			<div class="landing-eyebrow">integrations</div>
			<h2 class="landing-s-title">
				Works with any<br /><em> Coding Agent</em>
			</h2>
			<p class="landing-s-sub">Steerable plans to support all major coding harnesses.</p>

			<div class="landing-compat-grid">
				{#each integrations as item}
					<div class="landing-compat-item">
						<div
							class="h-2 w-2 shrink-0 rounded-full bg-agent shadow-[0_0_6px_rgba(0,212,170,0.5)]"
						></div>
						<div>
							<div class="text-[11px] text-agent-default">{item.name}</div>
							<div class="mt-0.5 text-[10px] text-agent-dim">{item.type}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ PRICING ═══════ -->
	<section id="pricing" class="landing-section">
		<div class="landing-section-inner reveal-on-scroll">
			<div class="landing-eyebrow">pricing</div>
			<h2 class="landing-s-title">
				Lifetime plans.<br /><em>Pay once</em>, use forever.
			</h2>

			<div class="landing-pricing-row">
				{#each plans as plan}
					<div class="landing-plan {plan.featured ? 'featured' : ''}">
						<div class="landing-plan-tag {plan.tagClass}">
							{#if plan.featured}
								<span
									class="mr-1 inline-block h-[5px] w-[5px] rounded-full bg-agent shadow-[0_0_5px_rgba(0,212,170,0.6)]"
								></span>
							{/if}
							{plan.tag}
						</div>
						<div class="mb-1.5 text-[15px] font-medium text-white">{plan.name}</div>
						<div class="mb-5 text-[11px] leading-[1.7] text-agent-dim">{plan.desc}</div>
						<div class="mb-5 flex items-baseline gap-1">
							{#if plan.price !== 'custom'}
								<span class="text-[13px] text-agent-subtle">$</span>
								<span class="text-[32px] leading-none font-semibold tracking-[-0.04em] text-white"
									>{plan.price}</span
								>
								<span class="text-[11px] text-agent-dim">{plan.period}</span>
							{:else}
								<span class="text-[22px] leading-[1.4] font-semibold text-white">custom</span>
							{/if}
						</div>
						<div class="mb-4.5 h-px bg-agent-border"></div>
						<ul class="flex flex-col gap-2.5">
							{#each plan.feats as feat}
								<li
									class="flex items-start gap-2.5 text-[11px] leading-[1.4] {feat.on
										? 'text-agent-subtle'
										: 'text-agent-dim'}"
								>
									<span
										class="mt-px w-3 shrink-0 text-center text-[10px] {feat.on
											? 'text-agent'
											: 'text-agent-dim'}"
									>
										{feat.on ? '✓' : '—'}
									</span>
									{feat.text}
								</li>
							{/each}
						</ul>
						<a href={plan.btnLink} target="_blank">
							<button class="mt-5 w-full {plan.btnClass}">{plan.btnText}</button>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════ CTA ═══════ -->
	<section id="cta" class="landing-section hidden">
		<div class="landing-cta-inner reveal-on-scroll">
			<div>
				<div class="landing-eyebrow">early access</div>
				<h2 class="landing-s-title">
					Your model thinks.<br />Let the world <em>see</em> it.
				</h2>
				<p class="landing-s-sub" style="margin-bottom:0">
					Join 800+ researchers, AI engineers, and educators already rendering reasoning into
					watchable stories. First render is always free.
				</p>
			</div>
			<div class="landing-cta-form">
				<label class="landing-form-label" for="email-input">work email</label>
				<input
					id="email-input"
					class="landing-form-input"
					type="email"
					placeholder="you@company.com"
				/>
				<label class="landing-form-label" for="usecase-input">what will you use it for?</label>
				<input
					id="usecase-input"
					class="landing-form-input"
					type="text"
					placeholder="research · teaching · product demos"
				/>
				<button class="landing-form-submit">REQUEST EARLY ACCESS →</button>
				<div class="mt-2.5 text-[10px] leading-[1.7] text-agent-dim">
					No credit card required · Renders in under 30s<br />Works with Claude, o1, DeepSeek,
					Gemini & more
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════ FOOTER ═══════ -->
	<footer class="landing-footer">
		<div class="flex items-center gap-2.5">
			<div class="landing-footer-badge">STEERABLE</div>
			<div class="text-[11px] text-agent-dim">Reasoning, rendered.</div>
		</div>
		<ul class="landing-footer-links">
			<li><a href="/app">demo</a></li>
			<li><a href="#docs">docs</a></li>
			<li><a href="#github">github</a></li>
			<li><a href="#privacy">privacy</a></li>
		</ul>
		<div class="text-[11px] text-agent-dim">© 2025 Steerable</div>
	</footer>
</div>

<style>
	/* ─── Root ─────────────────────────────────────────────────────── */
	.landing-root {
		background: #0a0e14;
		color: #c9d1d9;
		font-family: 'JetBrains Mono', monospace;
		font-size: 13px;
		line-height: 1.6;
		overflow-x: hidden;
		min-height: 100vh;
	}

	/* ─── Topbar ───────────────────────────────────────────────────── */
	.landing-topbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 200;
		height: 40px;
		background: #0d1117;
		border-bottom: 1px solid #21262d;
		display: flex;
		align-items: center;
		backdrop-filter: blur(12px);
	}

	.landing-brand {
		background: #00d4aa;
		color: #000;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		padding: 0 14px;
		height: 100%;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.landing-path {
		font-size: 11px;
		padding: 0 16px;
		letter-spacing: 0.04em;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.landing-nav {
		margin-left: auto;
		display: flex;
		align-items: center;
		height: 100%;
		padding-right: 8px;
	}

	.landing-nav-btn {
		background: transparent;
		color: #8b949e;
		border: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		padding: 0 14px;
		height: 100%;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	.landing-nav-btn:hover {
		background: #161b22;
		color: #c9d1d9;
	}

	.landing-cta-btn {
		background: rgba(0, 212, 170, 0.12);
		color: #00d4aa;
		border: 1px solid rgba(0, 212, 170, 0.2);
		border-radius: 3px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.08em;
		padding: 5px 14px;
		margin-left: 8px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.landing-cta-btn:hover {
		background: rgba(0, 212, 170, 0.25);
	}

	/* ─── Hero ─────────────────────────────────────────────────────── */
	.landing-hero {
		padding-top: 40px;
		min-height: 100vh;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		padding: 120px 48px 100px;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.hero-eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 10px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #00d4aa;
		margin-bottom: 28px;
		padding: 5px 12px;
		background: rgba(0, 212, 170, 0.08);
		border: 1px solid rgba(0, 212, 170, 0.15);
		border-radius: 20px;
		width: fit-content;
	}

	.hero-eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #00d4aa;
		box-shadow: 0 0 8px rgba(0, 212, 170, 0.6);
		animation: heroPulse 2s ease-in-out infinite;
	}

	@keyframes heroPulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.hero-title {
		font-size: 42px;
		font-weight: 500;
		color: #e6edf3;
		line-height: 1.15;
		letter-spacing: -0.03em;
		margin-bottom: 22px;
	}
	.hero-title em {
		font-style: normal;
		color: #00d4aa;
		text-shadow: 0 0 40px rgba(0, 212, 170, 0.2);
	}

	.hero-subtitle {
		font-size: 13px;
		color: #8b949e;
		line-height: 1.9;
		max-width: 440px;
		margin-bottom: 34px;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 32px;
	}

	.hero-btn-primary {
		background: #00d4aa;
		color: #000;
		border: none;
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		padding: 11px 24px;
		cursor: pointer;
		transition:
			background 0.15s,
			box-shadow 0.15s;
		box-shadow: 0 0 20px rgba(0, 212, 170, 0.15);
	}
	.hero-btn-primary:hover {
		background: #00ffc0;
		box-shadow: 0 0 30px rgba(0, 212, 170, 0.3);
	}

	.hero-btn-secondary {
		color: #8b949e;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.04em;
		text-decoration: none;
		padding: 11px 6px;
		transition: color 0.15s;
	}
	.hero-btn-secondary:hover {
		color: #e6edf3;
	}

	.hero-social-proof {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 10px;
		color: #484f58;
		letter-spacing: 0.04em;
	}

	.hero-sp-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #3fb950;
		box-shadow: 0 0 6px rgba(63, 185, 80, 0.5);
	}

	.hero-preview-container {
		position: relative;
		width: 100%;
		max-width: 580px;
		justify-self: start;
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
	}

	.hero-preview-stack {
		grid-area: 1 / 1;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* ─── Hero Terminal ──────────────────────────────────────────── */
	.hero-terminal {
		border: 1px solid #21262d;
		border-radius: 6px;
		overflow: hidden;
		background: #0d1117;
		box-shadow:
			0 0 0 1px rgba(0, 212, 170, 0.04),
			0 16px 48px rgba(0, 0, 0, 0.4),
			0 0 80px rgba(0, 212, 170, 0.04);
		animation: termFloat 6s ease-in-out infinite;
	}

	@keyframes termFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	.hero-term-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		background: #161b22;
		border-bottom: 1px solid #21262d;
	}

	.hero-term-dots {
		display: flex;
		gap: 5px;
	}
	.hero-term-dots span {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.dot-red {
		background: #f85149;
	}
	.dot-yellow {
		background: #e3b341;
	}
	.dot-green {
		background: #3fb950;
	}

	.hero-term-title {
		font-size: 11px;
		color: #484f58;
		margin-left: 4px;
	}

	.hero-term-body {
		padding: 18px 18px 22px;
		font-size: 11.5px;
		line-height: 1.85;
	}

	.tl {
		display: block;
		color: #484f58;
	}
	.tl-teal {
		color: #00d4aa;
	}
	.tl-white {
		color: #e6edf3;
	}
	.tl-dim {
		color: #484f58;
	}
	.tl-amber {
		color: #e3b341;
	}

	/* ─── Cursor blink ─────────────────────────────────────────────── */
	.landing-cursor {
		display: inline-block;
		width: 6px;
		height: 12px;
		background: #00d4aa;
		vertical-align: middle;
		margin-left: 2px;
		animation: landingBlink 1s step-end infinite;
		box-shadow: 0 0 6px rgba(0, 212, 170, 0.5);
	}
	@keyframes landingBlink {
		50% {
			opacity: 0;
		}
	}

	/* ─── Sections ─────────────────────────────────────────────────── */
	.landing-section {
		border-bottom: 1px solid #21262d;
	}

	.landing-section-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 80px 40px;
	}

	.landing-eyebrow {
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #00d4aa;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.landing-eyebrow::before {
		content: '';
		display: inline-block;
		width: 20px;
		height: 1px;
		background: #00d4aa;
	}

	.landing-s-title {
		font-size: 26px;
		font-weight: 500;
		color: #fff;
		line-height: 1.2;
		letter-spacing: -0.02em;
		margin-bottom: 14px;
		max-width: 500px;
	}
	.landing-s-title em {
		font-style: normal;
		color: #00d4aa;
	}

	.landing-s-sub {
		font-size: 12px;
		color: #8b949e;
		line-height: 1.8;
		max-width: 420px;
		margin-bottom: 44px;
	}

	/* ─── How It Works ─────────────────────────────────────────────── */
	.landing-steps-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid #21262d;
		border-radius: 4px;
		overflow: hidden;
	}

	.landing-how-step {
		padding: 28px 22px;
		border-right: 1px solid #21262d;
		transition: background 0.15s;
	}
	.landing-how-step:last-child {
		border-right: none;
	}
	.landing-how-step:hover {
		background: #161b22;
	}

	.landing-hs-num {
		font-size: 10px;
		color: #484f58;
		letter-spacing: 0.15em;
		margin-bottom: 18px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.landing-hs-num::after {
		content: '';
		flex: 1;
		height: 1px;
		background: #21262d;
	}

	.landing-hs-icon {
		width: 30px;
		height: 30px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		margin-bottom: 14px;
		background: #161b22;
	}

	.landing-hs-title {
		font-size: 13px;
		font-weight: 500;
		color: #fff;
		margin-bottom: 8px;
	}

	.landing-hs-desc {
		font-size: 11px;
		color: #8b949e;
		line-height: 1.8;
	}

	.landing-hs-tag {
		display: inline-block;
		margin-top: 14px;
		font-size: 10px;
		background: rgba(0, 212, 170, 0.12);
		color: #00d4aa;
		border: 1px solid rgba(0, 212, 170, 0.15);
		padding: 3px 8px;
		border-radius: 2px;
		letter-spacing: 0.08em;
	}

	/* ─── Features Grid ────────────────────────────────────────────── */
	.landing-features-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		background: #21262d;
		border: 1px solid #21262d;
		border-radius: 4px;
		overflow: hidden;
	}

	.landing-feat-card {
		background: #0d1117;
		padding: 26px 22px;
		transition: background 0.15s;
	}
	.landing-feat-card:hover {
		background: #161b22;
	}

	.landing-fc-code {
		margin-top: 14px;
		background: #0a0e14;
		border: 1px solid #21262d;
		border-radius: 3px;
		padding: 12px;
	}

	/* ─── Integrations ─────────────────────────────────────────────── */
	.landing-compat-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1px;
		background: #21262d;
		border: 1px solid #21262d;
		border-radius: 4px;
		overflow: hidden;
	}

	.landing-compat-item {
		background: #0d1117;
		padding: 18px 22px;
		flex: 1;
		min-width: 160px;
		display: flex;
		align-items: center;
		gap: 12px;
		transition: background 0.15s;
	}
	.landing-compat-item:hover {
		background: #161b22;
	}

	/* ─── Pricing ──────────────────────────────────────────────────── */
	.landing-pricing-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: #21262d;
		border: 1px solid #21262d;
		border-radius: 4px;
		overflow: hidden;
	}

	.landing-plan {
		background: #0d1117;
		padding: 26px 22px;
	}
	.landing-plan.featured {
		background: #161b22;
		outline: 1px solid rgba(0, 212, 170, 0.2);
		outline-offset: -1px;
	}

	.landing-plan-tag {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 2px;
		display: inline-flex;
		align-items: center;
		margin-bottom: 18px;
		border: 1px solid;
	}

	.landing-btn-ghost {
		background: transparent;
		color: #8b949e;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 3px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.06em;
		padding: 9px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.landing-btn-ghost:hover {
		border-color: #8b949e;
		color: #c9d1d9;
	}

	.landing-btn-solid {
		background: #00d4aa;
		color: #000;
		border: none;
		border-radius: 3px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		padding: 9px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.landing-btn-solid:hover {
		background: #00ffc0;
	}

	/* ─── CTA ──────────────────────────────────────────────────────── */
	.landing-cta-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 80px 40px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}

	.landing-cta-form {
		background: #0d1117;
		border: 1px solid #21262d;
		border-radius: 4px;
		padding: 22px;
	}

	.landing-form-label {
		font-size: 10px;
		color: #484f58;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin-bottom: 6px;
		display: block;
	}

	.landing-form-input {
		width: 100%;
		background: #0a0e14;
		border: 1px solid #21262d;
		color: #c9d1d9;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		padding: 9px 12px;
		border-radius: 3px;
		outline: none;
		transition: border-color 0.15s;
		margin-bottom: 12px;
	}
	.landing-form-input:focus {
		border-color: rgba(0, 212, 170, 0.4);
	}
	.landing-form-input::placeholder {
		color: #484f58;
	}

	.landing-form-submit {
		width: 100%;
		background: #00d4aa;
		color: #000;
		border: none;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		padding: 10px;
		border-radius: 3px;
		cursor: pointer;
		transition: background 0.15s;
		margin-top: 2px;
	}
	.landing-form-submit:hover {
		background: #00ffc0;
	}

	/* ─── Footer ───────────────────────────────────────────────────── */
	.landing-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 40px;
	}

	.landing-footer-badge {
		background: #00d4aa;
		color: #000;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		padding: 3px 8px;
		border-radius: 2px;
	}

	.landing-footer-links {
		display: flex;
		gap: 22px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.landing-footer-links a {
		font-size: 11px;
		color: #484f58;
		text-decoration: none;
		transition: color 0.15s;
	}
	.landing-footer-links a:hover {
		color: #c9d1d9;
	}

	/* ─── Reveal animation ─────────────────────────────────────────── */
	.reveal-on-scroll {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	:global(.revealed) {
		opacity: 1 !important;
		transform: translateY(0) !important;
	}

	/* ─── Responsive ───────────────────────────────────────────────── */
	@media (max-width: 860px) {
		.landing-hero {
			grid-template-columns: 1fr;
			padding: 120px 24px 60px;
			gap: 40px;
			min-height: auto;
		}
		.hero-title {
			font-size: 28px;
		}
		.hero-terminal {
			max-width: 100%;
		}
		.landing-steps-row,
		.landing-pricing-row {
			grid-template-columns: 1fr;
		}
		.landing-features-grid {
			grid-template-columns: 1fr;
		}
		.landing-cta-inner {
			grid-template-columns: 1fr;
			padding: 50px 24px;
		}
		.landing-section-inner {
			padding: 60px 24px;
		}
		.landing-footer {
			flex-direction: column;
			gap: 14px;
			padding: 20px 24px;
			text-align: center;
		}
		.landing-path {
			display: none;
		}
	}
</style>
