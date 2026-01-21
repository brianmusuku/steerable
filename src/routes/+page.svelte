<script lang="ts">
	import SidebarLeft from '$lib/components/sidebar-left.svelte';
	import SidebarRight from '$lib/components/sidebar-right.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/';
	import { Separator } from '$lib/components/ui/separator/';
	import * as Sidebar from '$lib/components/ui/sidebar/';

	import { onMount } from 'svelte';

	let html = $state('');

	onMount(async () => {
		const resp = await fetch('/api/data', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				prompt: 'Welcome to my website'
			})
		});

		const data = await resp.json();
		html = data.html;
	});
</script>

<svelte:head>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<Sidebar.Provider>
	<SidebarLeft />
	<Sidebar.Inset>
		<header class="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
			<div class="flex flex-1 items-center gap-2 px-3">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Page class="line-clamp-1">
								Project Management & Task Tracking
							</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex h-full flex-col bg-accent p-4">
			{@html html}
		</div>
	</Sidebar.Inset>
	<SidebarRight />
</Sidebar.Provider>
