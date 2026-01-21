<script lang="ts">
	import { Search } from '@lucide/svelte';

	import * as InputGroup from '$lib/components/ui/input-group/';

	let numResults = $state(0);
</script>

<div class="grid w-full p-4">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Find Agents..." />
		<InputGroup.Addon>
			<Search />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">{numResults} results</InputGroup.Addon>
	</InputGroup.Root>
</div>
