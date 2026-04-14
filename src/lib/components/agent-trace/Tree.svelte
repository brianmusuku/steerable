<script lang="ts" module>
	// This is sample data.
	const data = {
		changes: [
			{
				file: 'README.md',
				state: 'M'
			},
			{
				file: 'routes/+page.svelte',
				state: 'U'
			},
			{
				file: 'routes/+layout.svelte',
				state: 'M'
			}
		],
		tree: [
			['lib', ['components', 'button.svelte', 'card.svelte'], 'utils.ts'],
			[
				'routes',
				['hello', '+page.svelte', '+page.ts'],
				'+page.svelte',
				'+page.server.ts',
				'+layout.svelte'
			],
			['static', 'favicon.ico', 'svelte.svg'],
			'eslint.config.js',
			'.gitignore',
			'svelte.config.js',
			'tailwind.config.js',
			'package.json',
			'README.md'
		]
	};
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import type { ComponentProps } from 'svelte';
	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<div class="w-96 border p-8 text-sm">
	{#each data.tree as item, index (index)}
		{@render Tree({ item })}
	{/each}
</div>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
{#snippet Tree({ item }: { item: string | any[] })}
	{@const [name, ...items] = Array.isArray(item) ? item : [item]}
	{#if !items.length}
		<div class="flex items-center gap-1 p-1">
			<FileIcon class="size-4" />
			{name}
		</div>
	{:else}
		<Sidebar.MenuItem>
			<Collapsible.Root
				class="group/collapsible  [&[data-state=open]>button>svg:first-child]:rotate-90"
				open={name === 'lib' || name === 'components'}
			>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton {...props}>
							<ChevronRightIcon class="transition-transform" />
							<FolderIcon />
							{name}
						</Sidebar.MenuButton>
					{/snippet}
				</Collapsible.Trigger>
				<Collapsible.Content>
					<Sidebar.MenuSub>
						{#each items as subItem, index (index)}
							{@render Tree({ item: subItem })}
						{/each}
					</Sidebar.MenuSub>
				</Collapsible.Content>
			</Collapsible.Root>
		</Sidebar.MenuItem>
	{/if}
{/snippet}
