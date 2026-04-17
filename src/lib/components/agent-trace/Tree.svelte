<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Folder } from '@lucide/svelte';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import type { ComponentProps } from 'svelte';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let {
		ref = $bindable(null),
		filetree = '[]',
		currentFilename = '',
		onTreeMount,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		filetree?: string;
		currentFilename?: string;
		onTreeMount?: () => void;
	} = $props();

	let parsedTree = $derived.by(() => {
		try {
			const data = JSON.parse(filetree);
			// The filetree JSON has a root object without type: {"name":"root","children":[]}
			if (data && typeof data === 'object' && !Array.isArray(data)) {
				if (data.name === 'root' && Array.isArray(data.children)) {
					return data.children;
				}
				return [data];
			}
			return Array.isArray(data) ? data : [];
		} catch (e) {
			return [];
		}
	});

	let containerEl: HTMLDivElement;

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	onMount(() => {
		onTreeMount?.();
		const ctx = gsap.context(() => {
			// Animate the outer container sliding down + fading in
			gsap.from(containerEl, {
				opacity: 0,
				y: -12,
				duration: 0.4,
				ease: 'power2.out'
			});

			// Animate the header bar
			gsap.from(containerEl.querySelector('.tree-header'), {
				opacity: 0,
				x: -8,
				duration: 0.35,
				delay: 0.15,
				ease: 'power2.out'
			});

			// Stagger each top-level menu item
			gsap.from(containerEl.querySelectorAll('.tree-item'), {
				opacity: 0,
				x: -14,
				duration: 0.3,
				stagger: 0.055,
				delay: 0.25,
				ease: 'power2.out'
			});
		}, containerEl);

		return () => ctx.revert();
	});
</script>

<div bind:this={containerEl} class="w-140 rounded-lg border border-agent-border font-mono text-sm">
	<div
		class="tree-header flex items-center gap-2 rounded-t-lg border-b border-agent-border bg-agent-raised px-3.5 py-[7px]"
	>
		<Folder class="size-3 stroke-agent-bright stroke-2" />
		<span class="mt-1 text-[12px] text-agent-bright">Files</span>
	</div>
	<Sidebar.Menu class="px-4 pt-2 pb-4">
		{#each parsedTree as item, index (index)}
			{@render TreeNode({ item })}
		{/each}
	</Sidebar.Menu>
</div>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
{#snippet TreeNode({ item, path = '' }: { item: any; path?: string })}
	{@const itemPath = path ? `${path}/${item.name}` : item.name}
	{#if item.type === 'file'}
		<Sidebar.MenuItem>
			<div
				class="tree-item -mx-2 flex items-center gap-1 rounded-md px-2 py-1 transition-colors
				{itemPath === currentFilename ? 'animate-pulse-20 bg-agent/15 text-agent' : ''}"
			>
				<FileIcon class="size-4" />
				{item.name}
			</div>
		</Sidebar.MenuItem>
	{:else if item.type === 'folder'}
		<Sidebar.MenuItem>
			<Collapsible.Root
				class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				open={true}
			>
				<Collapsible.Trigger>
					{#snippet child({ props })}
						<button class="tree-item flex cursor-pointer items-center gap-1 py-1" {...props}>
							<ChevronRightIcon class="size-4 transition-transform" />
							<FolderIcon class="size-4" />
							{item.name}
						</button>
					{/snippet}
				</Collapsible.Trigger>
				<Collapsible.Content>
					<Sidebar.MenuSub>
						{#each item.children || [] as subItem, index (index)}
							{@render TreeNode({ item: subItem, path: itemPath })}
						{/each}
					</Sidebar.MenuSub>
				</Collapsible.Content>
			</Collapsible.Root>
		</Sidebar.MenuItem>
	{/if}
{/snippet}
