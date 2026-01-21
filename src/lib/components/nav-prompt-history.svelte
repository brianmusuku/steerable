<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import * as Sidebar from '$lib/components/ui/sidebar/';
	import { useSidebar } from '$lib/components/ui/sidebar/';
	import {
		ArrowUpRight as ArrowUpRightIcon,
		Ellipsis as EllipsisIcon,
		Link as LinkIcon,
		StarOff as StarOffIcon,
		Trash2 as Trash2Icon
	} from '@lucide/svelte';

	let { history }: { history: { name: string; url: string }[] } = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Edit History</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each history as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} title={item.name} {...props}>
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props }: any)}
							<Sidebar.MenuAction showOnHover {...props}>
								<EllipsisIcon />
								<span class="sr-only">More</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-56 rounded-lg"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align={sidebar.isMobile ? 'end' : 'start'}
					>
						<DropdownMenu.Item>
							<StarOffIcon class="text-muted-foreground" />
							<span>Remove from History</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<LinkIcon class="text-muted-foreground" />
							<span>Copy Link</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<ArrowUpRightIcon class="text-muted-foreground" />
							<span>Open in New Tab</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<Trash2Icon class="text-muted-foreground" />
							<span>Delete</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		{/each}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				<EllipsisIcon />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Group>
