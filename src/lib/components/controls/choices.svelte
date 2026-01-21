<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { onMount } from 'svelte';

	let choices = $state(['Small', 'Button', 'Group', 'Plus', 'Cursor', 'Disabled']);
	const addChoice = () => {
		choices.push('New Choice');
	};

	onMount(() => {
		// sort by length
		choices.sort((a, b) => a.length - b.length);
	});
</script>

<div class="flex flex-col gap-2 p-4">
	<span class="text-xs font-semibold">Themes Agent</span>
	<div class="flex flex-wrap items-start gap-2">
		{#each choices as choice}
			<Button class="cursor-pointer" variant="outline" size="sm">{choice}</Button>
		{/each}
	</div>
</div>
