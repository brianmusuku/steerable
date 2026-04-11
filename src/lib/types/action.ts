export interface ThoughtContent {
    paragraphs: string[];
}

export interface FileContent {
    filename: string;
    badge: string;
    lines: string[];
}

export interface TerminalLine {
    t: 'cmd' | 'dim' | 'ok' | 'err' | 'warn';
    text: string;
}

export interface TerminalContent {
    cwd: string;
    lines: TerminalLine[];
}

export interface DiffLine {
    t: 'ctx' | 'add' | 'del' | 'hunk';
    ln: string;
    text: string;
}

export interface DiffContent {
    filename: string;
    added: number;
    removed: number;
    lines: DiffLine[];
}

interface ActionBase {
    id: number;
    icon: string;
    kind: string;
    label: string;
    title: string;
    time: string;
}

export interface ThoughtAction extends ActionBase {
    type: 'thought';
    content: ThoughtContent;
}

export interface ReadAction extends ActionBase {
    type: 'read';
    content: FileContent;
}

export interface TerminalAction extends ActionBase {
    type: 'terminal';
    content: TerminalContent;
}

export interface FileAction extends ActionBase {
    type: 'file';
    content: FileContent;
}

export interface DiffAction extends ActionBase {
    type: 'diff';
    content: DiffContent;
}

export type Action =
    | ThoughtAction
    | ReadAction
    | TerminalAction
    | FileAction
    | DiffAction;

export type ActionType = Action['type'];

export type DiffLineType = DiffLine['t'];
export type TerminalLineType = TerminalLine['t'];