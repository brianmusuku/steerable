<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/';
	import { Button } from '$lib/components/ui/button/';
	import CloudIcon from '@tabler/icons-svelte/icons/cloud';
	import * as Resizable from '$lib/components/ui/resizable';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] w-full rounded-lg border">
		<Resizable.Pane defaultSize={75}>
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Sidebar</span>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={25}>
			<div class="flex h-full items-center justify-center p-6">
				<span class="font-semibold">Content</span>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
	<!-- <div class="flex w-10/12 flex-col items-center justify-center">
		<Empty.Root class="w-80 border border-dashed">
			<Empty.Header>
				<Empty.Media variant="icon">
					<CloudIcon />
				</Empty.Media>
				<Empty.Title>Cloud Storage Empty</Empty.Title>
				<Empty.Description>
					Upload files to your cloud storage to access them anywhere.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" size="sm">Upload Files</Button>
			</Empty.Content>
		</Empty.Root>
	</div>
	<div class="w-2/12"></div> -->
</div>
