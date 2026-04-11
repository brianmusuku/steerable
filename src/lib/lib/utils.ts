import type { DiffLineType, TerminalLineType } from '$lib/types/action';

/**
 * Escape HTML entities to safely render inside {@html} blocks.
 */
export function esc(s: string): string {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Map a diff line type to a Tailwind background class.
 */
export function diffBg(t: DiffLineType): string {
    if (t === 'add') return 'bg-agent-green-bg';
    if (t === 'del') return 'bg-agent-red-bg';
    if (t === 'hunk') return 'bg-agent-hunk-bg';
    return '';
}

/**
 * Map a diff line type to its leading sign character.
 */
export function diffSign(t: DiffLineType): string {
    if (t === 'add') return '+';
    if (t === 'del') return '-';
    if (t === 'hunk') return '@';
    return ' ';
}

/**
 * Map a diff line type to a Tailwind text-color class for the sign.
 */
export function diffSignColor(t: DiffLineType): string {
    if (t === 'add') return 'text-agent-green';
    if (t === 'del') return 'text-agent-red';
    if (t === 'hunk') return 'text-agent-blue';
    return '';
}

/**
 * Map a diff line type to Tailwind text-color classes for the content.
 */
export function diffTextColor(t: DiffLineType): string {
    if (t === 'add') return 'text-agent-green-text';
    if (t === 'del') return 'text-agent-red-text';
    if (t === 'hunk') return 'text-agent-blue italic';
    return 'text-agent-default';
}

/**
 * Map a terminal line type to a Tailwind text-color class.
 */
export function terminalLineColor(t: TerminalLineType): string {
    const map: Record<TerminalLineType, string> = {
        cmd: '',
        err: 'text-agent-red',
        ok: 'text-agent-green',
        warn: 'text-agent-yellow',
        dim: 'text-agent-dim'
    };
    return map[t];
}