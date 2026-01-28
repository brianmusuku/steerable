<script>
	import Feed from '$lib/components/Feed.svelte';
	import Map from '$lib/components/Map.svelte';
	import terrainData from '$lib/components/terrain_optimized.json';
</script>

<div class="flex h-screen w-full justify-center p-8">
	<div class="w-1/2 rounded-l-lg bg-[#FFFFFF] p-8 dark:bg-[#111111]">
		<Feed />
	</div>
	<div class="w-1/2">
		<Map {terrainData} />
	</div>
</div>
