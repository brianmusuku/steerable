<script>
	import { onMount } from 'svelte';

	const ACTIONS = [
		{
			id: 1,
			type: 'thought',
			icon: 'ai-thought',
			kind: 'thought',
			label: 'Reasoning',
			title: 'Analyzing the task',
			time: '0:00',
			content: {
				paragraphs: [
					`I need to build a <strong>JWT-based authentication system</strong> for this Express API. Looking at the project structure, I can see it's a TypeScript project with an existing <code>src/index.ts</code> entry point.`,
					`My plan: (1) Install <code>jsonwebtoken</code> and <code>bcrypt</code> packages, (2) Create <code>src/auth/jwt.ts</code> with token generation and verification helpers, (3) Create <code>src/auth/middleware.ts</code> for route protection, (4) Wire up the auth routes in <code>src/index.ts</code>, (5) Run tests and fix any issues.`
				]
			}
		},
		{
			id: 2,
			type: 'read',
			icon: 'ai-read',
			kind: 'read',
			label: 'File Read',
			title: 'Reading src/index.ts',
			time: '0:04',
			content: {
				filename: 'src/index.ts',
				badge: 'read',
				lines: [
					`import express from 'express';`,
					`import cors from 'cors';`,
					`import { json } from 'body-parser';`,
					``,
					`const app = express();`,
					`app.use(cors());`,
					`app.use(json());`,
					``,
					`app.get('/health', (req, res) => {`,
					`  res.json({ status: 'ok' });`,
					`});`,
					``,
					`app.listen(3000, () => {`,
					`  console.log('Server running on :3000');`,
					`});`,
					``,
					`export default app;`
				]
			}
		},
		{
			id: 3,
			type: 'terminal',
			icon: 'ai-terminal',
			kind: 'terminal',
			label: 'Shell',
			title: 'Installing dependencies',
			time: '0:12',
			content: {
				cwd: '~/project',
				lines: [
					{ t: 'cmd', text: 'npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt' },
					{ t: 'dim', text: '' },
					{ t: 'dim', text: 'added 12 packages, and audited 847 packages in 4s' },
					{ t: 'dim', text: '' },
					{ t: 'dim', text: '128 packages are looking for funding' },
					{ t: 'dim', text: '  run `npm fund` for details' },
					{ t: 'dim', text: '' },
					{ t: 'ok', text: 'found 0 vulnerabilities' }
				]
			}
		},
		{
			id: 4,
			type: 'file',
			icon: 'ai-file',
			kind: 'file',
			label: 'File Created',
			title: 'Creating src/auth/jwt.ts',
			time: '0:28',
			content: {
				filename: 'src/auth/jwt.ts',
				badge: 'new',
				lines: [
					`import jwt from 'jsonwebtoken';`,
					``,
					`const SECRET = process.env.JWT_SECRET ?? 'dev-secret';`,
					`const EXPIRES = process.env.JWT_EXPIRES ?? '7d';`,
					``,
					`export interface TokenPayload {`,
					`  userId: string;`,
					`  email: string;`,
					`  role: 'user' | 'admin';`,
					`}`,
					``,
					`export function signToken(payload: TokenPayload): string {`,
					`  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });`,
					`}`,
					``,
					`export function verifyToken(token: string): TokenPayload {`,
					`  return jwt.verify(token, SECRET) as TokenPayload;`,
					`}`
				]
			}
		},
		{
			id: 5,
			type: 'file',
			icon: 'ai-file',
			kind: 'file',
			label: 'File Created',
			title: 'Creating src/auth/middleware.ts',
			time: '0:41',
			content: {
				filename: 'src/auth/middleware.ts',
				badge: 'new',
				lines: [
					`import { Request, Response, NextFunction } from 'express';`,
					`import { verifyToken } from './jwt';`,
					``,
					`export function requireAuth(`,
					`  req: Request,`,
					`  res: Response,`,
					`  next: NextFunction`,
					`) {`,
					`  const header = req.headers.authorization;`,
					`  if (!header?.startsWith('Bearer ')) {`,
					`    return res.status(401).json({ error: 'Missing token' });`,
					`  }`,
					``,
					`  try {`,
					`    const token = header.slice(7);`,
					`    req.user = verifyToken(token);`,
					`    next();`,
					`  } catch {`,
					`    res.status(401).json({ error: 'Invalid token' });`,
					`  }`,
					`}`
				]
			}
		},
		{
			id: 6,
			type: 'diff',
			icon: 'ai-diff',
			kind: 'diff',
			label: 'File Modified',
			title: 'Adding auth routes to index.ts',
			time: '0:57',
			content: {
				filename: 'src/index.ts',
				added: 8,
				removed: 0,
				lines: [
					{ t: 'ctx', ln: '1', text: `import express from 'express';` },
					{ t: 'ctx', ln: '2', text: `import cors from 'cors';` },
					{ t: 'ctx', ln: '3', text: `import { json } from 'body-parser';` },
					{ t: 'add', ln: '4', text: `import { signToken, verifyToken } from './auth/jwt';` },
					{ t: 'add', ln: '5', text: `import { requireAuth } from './auth/middleware';` },
					{ t: 'ctx', ln: '6', text: `` },
					{ t: 'ctx', ln: '7', text: `const app = express();` },
					{ t: 'hunk', ln: '', text: `@@ -9,6 +11,22 @@ app.use(json());` },
					{ t: 'ctx', ln: '11', text: `app.get('/health', (req, res) => {` },
					{ t: 'ctx', ln: '12', text: `  res.json({ status: 'ok' });` },
					{ t: 'ctx', ln: '13', text: `});` },
					{ t: 'add', ln: '14', text: `` },
					{ t: 'add', ln: '15', text: `app.post('/auth/register', async (req, res) => {` },
					{ t: 'add', ln: '16', text: `  const { email, password } = req.body;` },
					{ t: 'add', ln: '17', text: `  // TODO: persist user to DB` },
					{
						t: 'add',
						ln: '18',
						text: `  const token = signToken({ userId: '1', email, role: 'user' });`
					},
					{ t: 'add', ln: '19', text: `  res.json({ token });` },
					{ t: 'add', ln: '20', text: `});` },
					{ t: 'add', ln: '21', text: `` },
					{ t: 'add', ln: '22', text: `app.get('/me', requireAuth, (req, res) => {` },
					{ t: 'add', ln: '23', text: `  res.json({ user: req.user });` },
					{ t: 'add', ln: '24', text: `});` }
				]
			}
		},
		{
			id: 7,
			type: 'terminal',
			icon: 'ai-terminal',
			kind: 'terminal',
			label: 'Shell',
			title: 'Running tests',
			time: '1:15',
			content: {
				cwd: '~/project',
				lines: [
					{ t: 'cmd', text: 'npm test' },
					{ t: 'dim', text: '' },
					{ t: 'dim', text: '> project@1.0.0 test' },
					{ t: 'dim', text: '> jest --coverage' },
					{ t: 'dim', text: '' },
					{ t: 'warn', text: 'FAIL  src/auth/jwt.test.ts' },
					{ t: 'err', text: '  ● signToken › should produce a verifiable token' },
					{ t: 'err', text: '' },
					{ t: 'err', text: '    expect(received).toBe(expected)' },
					{ t: 'err', text: `    Expected: "test@example.com"` },
					{ t: 'err', text: `    Received: undefined` },
					{ t: 'dim', text: '' },
					{ t: 'ok', text: 'PASS  src/index.test.ts' },
					{ t: 'dim', text: '' },
					{ t: 'dim', text: 'Tests: 1 failed, 3 passed, 4 total' }
				]
			}
		},
		{
			id: 8,
			type: 'diff',
			icon: 'ai-diff',
			kind: 'diff',
			label: 'File Modified',
			title: 'Fixing failing test in jwt.ts',
			time: '1:29',
			content: {
				filename: 'src/auth/jwt.ts',
				added: 2,
				removed: 2,
				lines: [
					{
						t: 'ctx',
						ln: '15',
						text: `export function verifyToken(token: string): TokenPayload {`
					},
					{ t: 'del', ln: '16', text: `  return jwt.verify(token, SECRET) as TokenPayload;` },
					{
						t: 'add',
						ln: '16',
						text: `  const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;`
					},
					{
						t: 'add',
						ln: '17',
						text: `  return { userId: decoded['userId'], email: decoded['email'], role: decoded['role'] };`
					},
					{ t: 'ctx', ln: '18', text: `}` }
				]
			}
		},
		{
			id: 9,
			type: 'terminal',
			icon: 'ai-terminal',
			kind: 'terminal',
			label: 'Shell',
			title: 'Final build — all tests pass',
			time: '1:44',
			content: {
				cwd: '~/project',
				lines: [
					{ t: 'cmd', text: 'npm test && npm run build' },
					{ t: 'dim', text: '' },
					{ t: 'ok', text: 'PASS  src/auth/jwt.test.ts' },
					{ t: 'ok', text: 'PASS  src/index.test.ts' },
					{ t: 'dim', text: '' },
					{ t: 'ok', text: 'Tests: 4 passed, 4 total' },
					{ t: 'ok', text: 'Coverage: 91.3%' },
					{ t: 'dim', text: '' },
					{ t: 'dim', text: '> project@1.0.0 build' },
					{ t: 'dim', text: '> tsc --outDir dist' },
					{ t: 'dim', text: '' },
					{ t: 'ok', text: 'Build complete → dist/' }
				]
			}
		}
	];

	const TYPE_ICONS = {
		thought: '&#x1F9E0;',
		read: '&#x1F4C4;',
		terminal: '&#x25A0;',
		file: '&#x2B;',
		diff: '&#x2A57;'
	};
	const TYPE_LABELS = {
		thought: 'Reasoning',
		read: 'File Read',
		terminal: 'Shell',
		file: 'File Created',
		diff: 'Diff'
	};
	const SPEEDS = [1, 2, 4];

	let current = $state(-1);
	let playing = $state(false);
	let speed = $state(1);
	let stageEl;
	let timer;

	let progress = $derived(current < 0 ? 0 : Math.round(((current + 1) / ACTIONS.length) * 100));
	let stepInfo = $derived(`${current < 0 ? '—' : current + 1} / ${ACTIONS.length}`);
	let currentAction = $derived(current >= 0 ? ACTIONS[current] : null);

	function esc(s) {
		return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function diffCls(t) {
		return t === 'add' ? 'add' : t === 'del' ? 'del' : t === 'hunk' ? 'hunk' : '';
	}

	function diffSign(t) {
		return t === 'add' ? '+' : t === 'del' ? '-' : t === 'hunk' ? '@' : ' ';
	}

	function jumpTo(idx) {
		current = idx;
		if (playing) schedNext();
	}

	function nextStep() {
		if (current < ACTIONS.length - 1) jumpTo(current + 1);
		else {
			playing = false;
			clearTimeout(timer);
		}
	}

	function prevStep() {
		if (current > 0) jumpTo(current - 1);
	}

	function togglePlay() {
		playing = !playing;
		if (playing) {
			if (current >= ACTIONS.length - 1) current = -1;
			nextStep();
		} else {
			clearTimeout(timer);
		}
	}

	function schedNext() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (playing) nextStep();
		}, 2500 / speed);
	}

	function cycleSpeed() {
		const idx = SPEEDS.indexOf(speed);
		speed = SPEEDS[(idx + 1) % SPEEDS.length];
	}

	$effect(() => {
		current;
		if (stageEl) stageEl.scrollTop = 0;
	});

	$effect(() => {
		current;
		if (current >= 0) {
			document.getElementById(`ch-${current}`)?.scrollIntoView({ block: 'nearest' });
		}
	});

	onMount(() => () => clearTimeout(timer));
</script>

<div class="av">
	<div class="av-hdr">
		<span class="av-logo">AgentTrace</span>
		<span class="av-session">session · build-auth-system · {ACTIONS.length} steps</span>
	</div>

	<div class="av-pb">
		<div class="av-pf" style="width: {progress}%"></div>
	</div>

	<div class="av-body">
		<aside class="av-sb">
			<div class="av-sbh">Timeline</div>
			{#each ACTIONS as a, i}
				<div
					class="av-ch {i < current ? 'done' : ''} {i === current ? 'active' : ''}"
					id="ch-{i}"
					onclick={() => jumpTo(i)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && jumpTo(i)}
				>
					<div class="av-cn">{i + 1}</div>
					<div class="av-ci">
						<div class="av-ct">{a.title}</div>
						<div class="av-ck ck-{a.kind}">{a.time} · {TYPE_LABELS[a.type] || a.type}</div>
					</div>
				</div>
			{/each}
		</aside>

		<main class="av-stage" bind:this={stageEl}>
			{#if currentAction}
				{#key current}
					<div class="av-action">
						<div class="av-ah">
							<div class="av-aicon {currentAction.icon}">
								{@html TYPE_ICONS[currentAction.type] || '?'}
							</div>
							<div class="av-am">
								<div class="av-alabel">{TYPE_LABELS[currentAction.type] || currentAction.type}</div>
								<div class="av-atitle">{currentAction.title}</div>
							</div>
							<span class="av-ats">{currentAction.time}</span>
						</div>

						{#if currentAction.type === 'thought'}
							<div class="thought">
								{#each currentAction.content.paragraphs as p}
									<p>{@html p}</p>
								{/each}
							</div>
						{:else if currentAction.type === 'read'}
							<div class="fv">
								<div class="fv-hdr">
									<span style="color:#ffa657;font-size:13px">&#x1F4C4;</span>
									<span class="fv-name">{currentAction.content.filename}</span>
									<span class="fbadge read">reading</span>
								</div>
								<div class="fv-body">
									{#each currentAction.content.lines as l, i}
										<div class="fvl">
											<span class="fvln">{i + 1}</span>
											<span class="fvc">{esc(l)}</span>
										</div>
									{/each}
								</div>
							</div>
						{:else if currentAction.type === 'file'}
							<div class="fv">
								<div class="fv-hdr">
									<span style="color:#e3b341;font-size:13px">&#x2B;</span>
									<span class="fv-name">{currentAction.content.filename}</span>
									<span class="fbadge new">{currentAction.content.badge || 'new'}</span>
								</div>
								<div class="fv-body">
									{#each currentAction.content.lines as l, i}
										<div class="fvl">
											<span class="fvln">{i + 1}</span>
											<span class="fvc">{esc(l)}</span>
										</div>
									{/each}
								</div>
							</div>
						{:else if currentAction.type === 'diff'}
							<div class="diff">
								<div class="diff-hdr">
									<span style="color:#79c0ff;font-size:13px">&#x2A57;</span>
									<span class="diff-fname">{currentAction.content.filename}</span>
									<span class="diff-stats">
										<span class="da">+{currentAction.content.added}</span>
										<span class="dd">-{currentAction.content.removed}</span>
									</span>
								</div>
								<div class="diff-body">
									{#each currentAction.content.lines as l}
										<div class="dl {diffCls(l.t)}">
											<span class="dln">{l.ln}</span>
											<span class="dsn">{diffSign(l.t)}</span>
											<span class="dc">{esc(l.text)}</span>
										</div>
									{/each}
								</div>
							</div>
						{:else if currentAction.type === 'terminal'}
							<div class="term">
								<div class="term-bar">
									<div class="td" style="background:#f85149"></div>
									<div class="td" style="background:#e3b341"></div>
									<div class="td" style="background:#3fb950"></div>
									<span class="term-title">{currentAction.content.cwd} — zsh</span>
								</div>
								<div class="term-body">
									{#each currentAction.content.lines as l}
										{#if l.t === 'cmd'}
											<div><span class="tp">❯</span> <span class="tc">{esc(l.text)}</span></div>
										{:else if l.t === 'err'}
											<div class="te">{esc(l.text)}</div>
										{:else if l.t === 'ok'}
											<div class="ts-ok">{esc(l.text)}</div>
										{:else if l.t === 'warn'}
											<div class="tw">{esc(l.text)}</div>
										{:else}
											<div class="td2">{esc(l.text)}</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/key}
			{:else}
				<div class="av-empty">
					<span style="font-size:28px">&#9654;</span>
					<span>Press play to begin</span>
					<span class="av-play-hint">or click any step in the timeline</span>
				</div>
			{/if}
		</main>
	</div>

	<div class="av-ctrls">
		<button class="cb" onclick={prevStep} title="Previous">&#9664;</button>
		<button class="cb primary" onclick={togglePlay}>
			{playing ? '&#9646;&#9646;' : '&#9654;'}
		</button>
		<button class="cb" onclick={nextStep} title="Next">&#9654;&#9654;</button>
		<span class="av-si">{stepInfo}</span>
		<button class="av-spd" onclick={cycleSpeed}>{speed}×</button>
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.av {
		background: #0b0f14;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-family: var(--font-sans);
		color: #c9d1d9;
		border: 1px solid #21262d;
	}
	.av-hdr {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		background: #0d1117;
		border-bottom: 1px solid #21262d;
		flex-shrink: 0;
	}
	.av-logo {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #00d4aa;
		background: #003d2e;
		padding: 3px 8px;
		border-radius: 4px;
	}
	.av-session {
		font-size: 12px;
		color: #484f58;
		font-family: var(--font-mono);
	}
	.av-pb {
		height: 2px;
		background: #21262d;
		flex-shrink: 0;
	}
	.av-pf {
		height: 100%;
		background: #00d4aa;
		transition: width 0.5s ease;
	}
	.av-body {
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.av-sb {
		width: 252px;
		flex-shrink: 0;
		background: #0d1117;
		border-right: 1px solid #21262d;
		overflow-y: auto;
	}
	.av-sb::-webkit-scrollbar {
		width: 3px;
	}
	.av-sb::-webkit-scrollbar-thumb {
		background: #21262d;
	}
	.av-sbh {
		padding: 10px 14px 5px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #484f58;
		font-family: var(--font-mono);
	}
	.av-ch {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		padding: 7px 12px 7px 14px;
		cursor: pointer;
		border-left: 2px solid transparent;
		transition: all 0.12s;
	}
	.av-ch:hover {
		background: #161b22;
	}
	.av-ch.active {
		background: #161b22;
		border-left-color: #00d4aa;
	}
	.av-ch.done .av-cn {
		background: #1a3a2a;
		color: #3fb950;
	}
	.av-ch.active .av-cn {
		background: #003d2e;
		color: #00d4aa;
		box-shadow: 0 0 0 1px #00d4aa40;
	}
	.av-cn {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #21262d;
		color: #484f58;
		font-size: 9px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 2px;
		font-family: var(--font-mono);
	}
	.av-ci {
		flex: 1;
		min-width: 0;
	}
	.av-ct {
		font-size: 11px;
		font-weight: 500;
		color: #8b949e;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.4;
	}
	.av-ch.active .av-ct {
		color: #e6edf3;
	}
	.av-ck {
		font-size: 10px;
		color: #484f58;
		margin-top: 1px;
		font-family: var(--font-mono);
	}
	.ck-terminal {
		color: #3fb950;
	}
	.ck-diff {
		color: #79c0ff;
	}
	.ck-file {
		color: #e3b341;
	}
	.ck-thought {
		color: #bc8cff;
	}
	.ck-read {
		color: #ffa657;
	}
	.av-stage {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		background: #0a0e14;
		padding: 20px;
	}
	.av-stage::-webkit-scrollbar {
		width: 5px;
	}
	.av-stage::-webkit-scrollbar-thumb {
		background: #21262d;
		border-radius: 3px;
	}
	.av-action {
		animation: fadeUp 0.25s ease;
	}
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.av-ah {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
	}
	.av-aicon {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		flex-shrink: 0;
	}
	.ai-terminal {
		background: #1a3a2a;
		color: #3fb950;
	}
	.ai-diff {
		background: #0d2136;
		color: #79c0ff;
	}
	.ai-file {
		background: #2d2000;
		color: #e3b341;
	}
	.ai-thought {
		background: #1e1232;
		color: #bc8cff;
	}
	.ai-read {
		background: #2d1a00;
		color: #ffa657;
	}
	.av-am {
		flex: 1;
	}
	.av-alabel {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #484f58;
		font-family: var(--font-mono);
	}
	.av-atitle {
		font-size: 14px;
		font-weight: 600;
		color: #e6edf3;
		margin-top: 1px;
	}
	.av-ats {
		font-size: 10px;
		color: #484f58;
		font-family: var(--font-mono);
	}
	.term {
		background: #0d1117;
		border: 1px solid #21262d;
		border-radius: 8px;
		overflow: hidden;
	}
	.term-bar {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 7px 12px;
		background: #161b22;
		border-bottom: 1px solid #21262d;
	}
	.td {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.term-title {
		font-size: 10px;
		color: #484f58;
		font-family: var(--font-mono);
		margin-left: 6px;
	}
	.term-body {
		padding: 12px 16px;
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.75;
		color: #c9d1d9;
	}
	.tc {
		color: #79c0ff;
	}
	.tp {
		color: #3fb950;
	}
	.te {
		color: #f85149;
	}
	.ts-ok {
		color: #3fb950;
	}
	.tw {
		color: #e3b341;
	}
	.td2 {
		color: #484f58;
	}
	.diff {
		border: 1px solid #21262d;
		border-radius: 8px;
		overflow: hidden;
	}
	.diff-hdr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 14px;
		background: #161b22;
		border-bottom: 1px solid #21262d;
	}
	.diff-fname {
		font-size: 11px;
		font-family: var(--font-mono);
		color: #e6edf3;
	}
	.diff-stats {
		margin-left: auto;
		font-size: 10px;
		font-family: var(--font-mono);
		color: #484f58;
	}
	.da {
		color: #3fb950;
	}
	.dd {
		color: #f85149;
	}
	.diff-body {
		font-family: var(--font-mono);
		font-size: 11.5px;
		line-height: 1.65;
	}
	.dl {
		display: flex;
		padding: 0 14px;
	}
	.dl.add {
		background: #0d2c1a;
	}
	.dl.del {
		background: #2c0f0f;
	}
	.dl.hunk {
		background: #0d1e35;
	}
	.dln {
		width: 34px;
		color: #484f58;
		text-align: right;
		padding-right: 10px;
		flex-shrink: 0;
		user-select: none;
		font-size: 10px;
	}
	.dsn {
		width: 14px;
		flex-shrink: 0;
	}
	.dl.add .dsn {
		color: #3fb950;
	}
	.dl.del .dsn {
		color: #f85149;
	}
	.dl.hunk .dsn {
		color: #79c0ff;
	}
	.dc {
		color: #c9d1d9;
		white-space: pre;
	}
	.dl.add .dc {
		color: #aff5b4;
	}
	.dl.del .dc {
		color: #ffa198;
	}
	.dl.hunk .dc {
		color: #79c0ff;
		font-style: italic;
	}
	.fv {
		border: 1px solid #21262d;
		border-radius: 8px;
		overflow: hidden;
	}
	.fv-hdr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 14px;
		background: #161b22;
		border-bottom: 1px solid #21262d;
	}
	.fv-name {
		font-size: 11px;
		font-family: var(--font-mono);
		color: #e6edf3;
	}
	.fbadge {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.06em;
		padding: 2px 7px;
		border-radius: 3px;
		text-transform: uppercase;
	}
	.fbadge.new {
		background: #1a3a2a;
		color: #3fb950;
	}
	.fbadge.read {
		background: #2d1a00;
		color: #ffa657;
	}
	.fv-body {
		font-family: var(--font-mono);
		font-size: 11.5px;
		line-height: 1.65;
	}
	.fvl {
		display: flex;
		padding: 0 14px;
	}
	.fvl:hover {
		background: #161b22;
	}
	.fvln {
		width: 34px;
		color: #484f58;
		text-align: right;
		padding-right: 10px;
		flex-shrink: 0;
		user-select: none;
		font-size: 10px;
	}
	.fvc {
		color: #c9d1d9;
		white-space: pre;
	}
	.thought {
		background: #12102a;
		border: 1px solid #2d2466;
		border-radius: 8px;
		padding: 20px 22px;
	}
	.thought p {
		font-size: 13px;
		line-height: 1.9;
		color: #c9d1d9;
	}
	.thought p + p {
		margin-top: 10px;
	}
	.thought strong {
		color: #e6edf3;
	}
	.thought code {
		font-family: var(--font-mono);
		background: #1e1a3a;
		color: #bc8cff;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 11px;
	}
	.av-ctrls {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		background: #0d1117;
		border-top: 1px solid #21262d;
		flex-shrink: 0;
	}
	.cb {
		background: none;
		border: none;
		cursor: pointer;
		color: #8b949e;
		padding: 5px 8px;
		border-radius: 4px;
		font-size: 13px;
		transition: all 0.12s;
		display: flex;
		align-items: center;
		line-height: 1;
	}
	.cb:hover {
		background: #21262d;
		color: #e6edf3;
	}
	.cb.primary {
		color: #00d4aa;
	}
	.cb.primary:hover {
		background: #003d2e;
	}
	.av-si {
		font-size: 11px;
		font-family: var(--font-mono);
		color: #484f58;
		margin-left: 4px;
	}
	.av-spd {
		margin-left: auto;
		font-size: 10px;
		font-family: var(--font-mono);
		color: #484f58;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 4px;
		border: 1px solid #21262d;
		background: none;
		transition: all 0.12s;
	}
	.av-spd:hover {
		border-color: #484f58;
		color: #8b949e;
	}
	.av-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 10px;
		color: #484f58;
		font-size: 13px;
	}
	.av-play-hint {
		font-size: 11px;
		font-family: var(--font-mono);
	}
</style>
