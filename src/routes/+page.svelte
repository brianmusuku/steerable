<script lang="ts">
	import { onMount } from 'svelte';

	let html = $state('');

	onMount(async () => {
		const resp = await fetch('/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: 'hello'
			})
		});

		const data = await resp.json();
		html = data.html;
	});
</script>

{@html html}
