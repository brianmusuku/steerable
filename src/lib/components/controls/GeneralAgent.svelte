<script lang="ts">
	import { Plus, ArrowUpIcon } from '@lucide/svelte';

	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
</script>

<div class="flex flex-col gap-2 border-t p-4">
	<span class="text-xs font-semibold">General Agent</span>
	<InputGroup.Root>
		<InputGroup.Textarea placeholder="Ask, Search or Chat..." />
		<InputGroup.Addon align="block-end">
			<InputGroup.Button variant="outline" class="rounded-full" size="icon-xs">
				<Plus />
			</InputGroup.Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props }: any)}
						<InputGroup.Button {...props} variant="ghost">Auto</InputGroup.Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content side="top" align="start" class="[--radius:0.95rem]">
					<DropdownMenu.Item>Auto</DropdownMenu.Item>
					<DropdownMenu.Item>Agent</DropdownMenu.Item>
					<DropdownMenu.Item>Manual</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<InputGroup.Text class="ms-auto">52% used</InputGroup.Text>
			<Separator orientation="vertical" class="!h-4" />
			<InputGroup.Button variant="default" class="rounded-full" size="icon-xs" disabled>
				<ArrowUpIcon />
				<span class="sr-only">Send</span>
			</InputGroup.Button>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
