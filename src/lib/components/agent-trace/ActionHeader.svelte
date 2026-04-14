<script lang="ts">
	import { Folder } from '@lucide/svelte';

	let { currentView } = $props();
</script>

<div class="mb-4 flex items-center gap-2.5 p-8">
	<div
		class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-agent-green-bg text-[15px] text-agent-green"
	>
		<Folder class="size-4" />
	</div>

	<div class="min-w-0 flex-1">
		<div class="font-mono text-[9px] font-bold tracking-widest text-agent-dim uppercase">
			{currentView.filename}
		</div>
		<div class="mt-px text-sm font-semibold text-agent-bright">{currentView.title}</div>
	</div>
</div>
