<script lang="ts">
	import type { Action } from '$lib/types/action';
	import { TYPE_CONFIG, TYPE_STYLES } from '$lib/data/action';

	let { action }: { action: Action } = $props();

	let config = $derived(TYPE_CONFIG[action.type]);
	let styles = $derived(TYPE_STYLES[action.type]);
</script>

<div class="mb-4 flex items-center gap-2.5">
	<div
		class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg text-[15px] {styles.bg} {styles.text}"
	>
		{@html config.icon}
	</div>

	<div class="min-w-0 flex-1">
		<div class="font-mono text-[9px] font-bold tracking-[0.1em] text-agent-dim uppercase">
			{config.label}
		</div>
		<div class="mt-px text-sm font-semibold text-agent-bright">
			{action.title}
		</div>
	</div>

	<span class="font-mono text-[10px] text-agent-dim">
		{action.time}
	</span>
</div>
