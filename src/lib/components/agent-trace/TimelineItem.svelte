<script lang="ts">
	const TYPE_CONFIG: Record<string, { label: string }> = {
		thought: { label: 'Reasoning' },
		read: { label: 'File' },
		terminal: { label: 'Shell' },
		file: { label: 'File' },
		diff: { label: 'Diff' }
	};

	const KIND_COLORS: Record<string, string> = {
		thought: 'text-agent-purple',
		read: 'text-agent-blue',
		terminal: 'text-agent-blue',
		file: 'text-agent-blue',
		diff: 'text-agent-blue'
	};

	const VISUAL_TO_KIND: Record<string, string> = {
		'folder tree viewer': 'directory',
		'file viewer': 'read',
		'command line shell': 'terminal',
		'code diff': 'diff'
	};

	interface NarrationAction {
		title: string;
		visual: string;
		[key: string]: any;
	}

	let {
		action,
		index,
		isDone,
		isActive,
		onJump
	}: {
		action: NarrationAction;
		index: number;
		isDone: boolean;
		isActive: boolean;
		onJump: () => void;
	} = $props();

	let type = $derived(VISUAL_TO_KIND[action.visual] ?? 'thought');
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
		<div class="mt-px flex items-center gap-1 font-mono text-[10px] {kindColor}">
			<span>{config?.label ?? action.visual}</span>
		</div>
	</div>
</button>
