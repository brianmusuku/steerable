<script lang="ts">
	import type { Action } from '$lib/types/action';
	import { TYPE_CONFIG, KIND_COLORS } from '$lib/data/action';

	let {
		action,
		index,
		isDone,
		isActive,
		onJump
	}: {
		action: Action;
		index: number;
		isDone: boolean;
		isActive: boolean;
		onJump: () => void;
	} = $props();

	let config = $derived(TYPE_CONFIG[action.type]);
	let kindColor: string = $derived(KIND_COLORS[action.kind] ?? 'text-agent-dim');
</script>

<button
	id="ch-{index}"
	class="flex w-full cursor-pointer items-start gap-[9px] border-l-2 py-[7px] pr-3 pl-3.5 text-left transition-all duration-100
    {isActive ? 'border-l-agent bg-agent-raised' : 'border-l-transparent hover:bg-agent-raised'}"
	onclick={onJump}
	onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && onJump()}
>
	<span
		class="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold
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
			{action.time} · {config.label}
		</div>
	</div>
</button>
