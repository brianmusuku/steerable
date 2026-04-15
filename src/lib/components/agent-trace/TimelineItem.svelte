<script lang="ts">
	import { TYPE_CONFIG, KIND_COLORS } from '$lib/data/action';

	let {
		action,
		index,
		isDone,
		isActive,
		onJump
	}: {
		action: any;
		index: number;
		isDone: boolean;
		isActive: boolean;
		onJump: () => void;
	} = $props();

	function getType(visual: string) {
		switch (visual) {
			case 'folder tree viewer':
				return 'file';
			case 'file viewer':
				return 'read';
			case 'command line shell':
				return 'terminal';
			case 'code diff':
				return 'diff';
			default:
				return 'thought';
		}
	}

	let type = $derived(getType(action.visual));
	let config = $derived(TYPE_CONFIG[type]);
	let kindColor: string = $derived(KIND_COLORS[type] ?? 'text-agent-dim');
</script>

<button
	id="ch-{index}"
	class="flex w-full cursor-pointer items-start gap-[9px] border-l-2 py-[7px] pr-3 pl-3.5 text-left transition-all duration-100
    {isActive ? 'border-l-agent bg-agent-raised' : 'border-l-transparent hover:bg-agent-raised'}"
	onclick={onJump}
	onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && onJump()}
>
	<span
		class="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold
      {isDone
			? 'bg-agent-green-bg text-agent-green'
			: isActive
				? 'bg-agent-muted text-agent shadow-[0_0_0_1px_#00d4aa40]'
				: 'bg-agent-border text-agent-dim'}"
	>
		{index + 1}
	</span>

	<div class="min-w-0 flex-1">
		<div
			class="truncate text-[11px] leading-snug
        {isActive ? 'font-medium text-agent-bright' : 'font-medium text-agent-subtle'}"
		>
			{action.title}
		</div>
		<div class="mt-px font-mono text-[10px] {kindColor}">
			{config?.label ?? action.visual}
		</div>
	</div>
</button>
