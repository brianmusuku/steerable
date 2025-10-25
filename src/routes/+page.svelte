<script lang="ts">
	import * as Empty from '$lib/components/ui/empty/';
	import { Button } from '$lib/components/ui/button/';
	import * as Resizable from '$lib/components/ui/resizable';
	import {
		IconArrowBackUp,
		IconArrowForwardUp,
		IconAlignJustified,
		IconAlertTriangle,
		IconH1,
		IconItalic,
		IconLink,
		IconList,
		IconEdit,
		IconAlignCenter,
		IconAlignRight
	} from '@tabler/icons-svelte';
	import Editor from '$lib/Editor.svelte';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] w-full bg-muted">
		<Resizable.Pane defaultSize={75}>
			<div class="m-4 mr-2 flex h-[97%] items-center justify-center rounded-lg border bg-white">
				<Empty.Root class="w-80 ">
					<Empty.Header>
						<Empty.Media variant="icon">
							<IconEdit />
						</Empty.Media>
						<Empty.Title>Canvas Empty</Empty.Title>
						<Empty.Description>
							Write your website copy on the editor to the right.
						</Empty.Description>
					</Empty.Header>
					<Empty.Content></Empty.Content>
				</Empty.Root>
			</div>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={25}>
			<div class="mt-4 flex h-full flex-col gap-2">
				<div class="mr-4 ml-2 flex h-[55%] flex-col rounded-lg border bg-white">
					<div class="flex w-full items-center justify-center gap-2 border-b py-2">
						<IconArrowBackUp class="size-5 stroke-1" />
						<IconArrowForwardUp class="size-5 stroke-1" />
						<div class="h-6 border border-l"></div>
						<IconList class="size-5 stroke-1" />
						<IconAlignJustified class="size-5 stroke-1" />
						<IconAlignCenter class="size-5 stroke-1" />
						<IconAlignRight class="size-5 stroke-1" />
						<div class="h-6 border border-l"></div>
						<IconLink class="size-5 stroke-1" />
						<IconH1 class="size-5 stroke-1" />
						<IconItalic class="size-5 stroke-1" />
					</div>
					<!-- <Editor /> -->
				</div>
				<div class="mr-4 ml-2 flex h-[41%] flex-col rounded-lg border bg-white">
					<Empty.Root class="w-auto">
						<Empty.Header>
							<Empty.Media variant="icon">
								<IconAlertTriangle />
							</Empty.Media>
							<Empty.Title>No Components</Empty.Title>
							<Empty.Description>Write your website copy on the editor above.</Empty.Description>
						</Empty.Header>
						<Empty.Content></Empty.Content>
					</Empty.Root>
				</div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
