<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { genState } from '$lib/genState.svelte';
	import { onMount } from 'svelte';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let choices = $state(['Unstyled']);
	let isLoading = $state(false);

	const addChoice = () => {
		choices.push('New Choice');
	};

	const getThemes = async (currentHtml: string) => {
		isLoading = true;
		const resp = await fetch('/api/getThemes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: currentHtml
			})
		});

		const { themes } = await resp.json();
		console.log(themes);
		if (!themes) {
			isLoading = false;
			toast.error('API Limit reached! Failed to get themes!');
			return;
		}
		choices = [...themes, ...choices];
		isLoading = false;
		//choices.sort((a, b) => a.length - b.length);
	};

	onMount(async () => {
		// sort by length
		choices.sort((a, b) => a.length - b.length);
	});
</script>

<div class="flex flex-col gap-2 p-4">
	<span class="text-xs font-semibold">Themes Agent</span>

	<div class=" flex max-h-28 flex-wrap items-start gap-2 overflow-y-auto">
		{#each choices as choice}
			<Button class="cursor-pointer" variant="outline" size="sm">{choice}</Button>
		{/each}
		<Button
			class="cursor-pointer"
			variant="outline"
			size="sm"
			onclick={() => getThemes(genState.currentHtml)}
		>
			{#if isLoading}
				<LoaderCircle class="size-4 animate-spin" />Adding themes...
			{:else}
				<Plus class="size-4" />
			{/if}
		</Button>
	</div>
</div>
