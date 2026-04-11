<script lang="ts">
	import type { ThoughtContent } from '$lib/types/action';

	let { content }: { content: ThoughtContent } = $props();
</script>

<div
	class="thought-block rounded-lg border border-agent-thought-border bg-agent-thought-bg px-5 py-5"
>
	{#each content.paragraphs as p, i}
		<p class="text-[13px] leading-[1.9] text-agent-default {i > 0 ? 'mt-2.5' : ''}">
			{@html p}
		</p>
	{/each}
</div>
