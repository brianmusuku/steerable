<script lang="ts">
	import { Play } from '@lucide/svelte';

	let { start }: { start: () => void } = $props();
</script>

<div class="flex h-full flex-col items-center justify-center gap-2.5 text-[13px] text-agent-dim">
	<Play class="size-12 cursor-pointer fill-agent stroke-0" onclick={start} />
	<span>Press play to begin</span>
	<span class="font-mono text-[11px]">or click any step in the timeline</span>
</div>
