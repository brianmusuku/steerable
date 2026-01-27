<script>
	import Feed from '$lib/components/Feed.svelte';
	import Map from '$lib/components/Map.svelte';
	import terrainData from '$lib/components/terrain_optimized.json';
</script>

<div class="flex h-screen w-full justify-center gap-6 p-8">
	<div class="w-1/2 rounded-lg bg-[#111111] p-8">
		<Feed />
	</div>
	<div class="w-1/2">
		<Map {terrainData} />
	</div>
</div>
