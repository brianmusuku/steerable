<script lang="ts">
	import Timeline from './Timeline.svelte';
	import Stage from './Stage.svelte';
	import { narration } from '$lib/data/llm_output2';

	let current: number = $state(-1);
</script>

<div
	class="dark flex h-screen flex-col overflow-hidden border border-agent-border bg-agent font-sans text-agent-default"
>
	<div
		class="flex shrink-0 items-center gap-2.5 border-b border-agent-border bg-agent-surface px-4 py-2.5"
	>
		<span
			class="rounded bg-agent-muted px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-agent uppercase"
		>
			AgentTrace
		</span>
		<span class="font-mono text-xs text-agent-dim">
			session · build-auth-system · {narration.content.length} steps
		</span>
	</div>

	<div class="flex min-h-0 flex-1">
		<Timeline {current} actions={narration.content} onJump={(i) => (current = i)} />
		<Stage bind:index={current} />
	</div>
</div>
