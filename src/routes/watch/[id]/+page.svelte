<script lang="ts">
	import AgentTrace from '$lib/components/agent-trace/AgentTrace.svelte';
	let { data } = $props();
</script>

<AgentTrace narration={data.narration} id={data.id} />
