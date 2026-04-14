import type { Action, ActionType } from '$lib/types/action';

export const ACTIONS: Action[] = [
    {
        id: 2,
        type: 'read',
        icon: 'ai-read',
        kind: 'read',
        label: 'File Read',
        title: 'Reading src/index.ts',
        time: '0:04',
        content: {
            filename: 'src/index.ts',
            badge: 'read',
            lines: [
                `import express from 'express';`,
                `import cors from 'cors';`,
                `import { json } from 'body-parser';`,
                ``,
                `const app = express();`,
                `app.use(cors());`,
                `app.use(json());`,
                ``,
                `app.get('/health', (req, res) => {`,
                `  res.json({ status: 'ok' });`,
                `});`,
                ``,
                `app.listen(3000, () => {`,
                `  console.log('Server running on :3000');`,
                `});`,
                ``,
                `export default app;`
            ]
        }
    },
    {
        id: 3,
        type: 'terminal',
        icon: 'ai-terminal',
        kind: 'terminal',
        label: 'Shell',
        title: 'Installing dependencies',
        time: '0:12',
        content: {
            cwd: '~/project',
            lines: [
                { t: 'cmd', text: 'npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt' },
                { t: 'dim', text: '' },
                { t: 'dim', text: 'added 12 packages, and audited 847 packages in 4s' },
                { t: 'dim', text: '' },
                { t: 'dim', text: '128 packages are looking for funding' },
                { t: 'dim', text: '  run `npm fund` for details' },
                { t: 'dim', text: '' },
                { t: 'ok', text: 'found 0 vulnerabilities' }
            ]
        }
    },
    {
        id: 4,
        type: 'file',
        icon: 'ai-file',
        kind: 'file',
        label: 'File Created',
        title: 'Creating src/auth/jwt.ts',
        time: '0:28',
        content: {
            filename: 'src/auth/jwt.ts',
            badge: 'new',
            lines: [
                `import jwt from 'jsonwebtoken';`,
                ``,
                `const SECRET = process.env.JWT_SECRET ?? 'dev-secret';`,
                `const EXPIRES = process.env.JWT_EXPIRES ?? '7d';`,
                ``,
                `export interface TokenPayload {`,
                `  userId: string;`,
                `  email: string;`,
                `  role: 'user' | 'admin';`,
                `}`,
                ``,
                `export function signToken(payload: TokenPayload): string {`,
                `  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });`,
                `}`,
                ``,
                `export function verifyToken(token: string): TokenPayload {`,
                `  return jwt.verify(token, SECRET) as TokenPayload;`,
                `}`
            ]
        }
    },
    {
        id: 5,
        type: 'file',
        icon: 'ai-file',
        kind: 'file',
        label: 'File Created',
        title: 'Creating src/auth/middleware.ts',
        time: '0:41',
        content: {
            filename: 'src/auth/middleware.ts',
            badge: 'new',
            lines: [
                `import { Request, Response, NextFunction } from 'express';`,
                `import { verifyToken } from './jwt';`,
                ``,
                `export function requireAuth(`,
                `  req: Request,`,
                `  res: Response,`,
                `  next: NextFunction`,
                `) {`,
                `  const header = req.headers.authorization;`,
                `  if (!header?.startsWith('Bearer ')) {`,
                `    return res.status(401).json({ error: 'Missing token' });`,
                `  }`,
                ``,
                `  try {`,
                `    const token = header.slice(7);`,
                `    req.user = verifyToken(token);`,
                `    next();`,
                `  } catch {`,
                `    res.status(401).json({ error: 'Invalid token' });`,
                `  }`,
                `}`
            ]
        }
    },
    {
        id: 6,
        type: 'diff',
        icon: 'ai-diff',
        kind: 'diff',
        label: 'File Modified',
        title: 'Adding auth routes to index.ts',
        time: '0:57',
        content: {
            filename: 'src/index.ts',
            added: 8,
            removed: 0,
            lines: [
                { t: 'ctx', ln: '1', text: `import express from 'express';` },
                { t: 'ctx', ln: '2', text: `import cors from 'cors';` },
                { t: 'ctx', ln: '3', text: `import { json } from 'body-parser';` },
                { t: 'add', ln: '4', text: `import { signToken, verifyToken } from './auth/jwt';` },
                { t: 'add', ln: '5', text: `import { requireAuth } from './auth/middleware';` },
                { t: 'ctx', ln: '6', text: `` },
                { t: 'ctx', ln: '7', text: `const app = express();` },
                { t: 'hunk', ln: '', text: `@@ -9,6 +11,22 @@ app.use(json());` },
                { t: 'ctx', ln: '11', text: `app.get('/health', (req, res) => {` },
                { t: 'ctx', ln: '12', text: `  res.json({ status: 'ok' });` },
                { t: 'ctx', ln: '13', text: `});` },
                { t: 'add', ln: '14', text: `` },
                { t: 'add', ln: '15', text: `app.post('/auth/register', async (req, res) => {` },
                { t: 'add', ln: '16', text: `  const { email, password } = req.body;` },
                { t: 'add', ln: '17', text: `  // TODO: persist user to DB` },
                {
                    t: 'add',
                    ln: '18',
                    text: `  const token = signToken({ userId: '1', email, role: 'user' });`
                },
                { t: 'add', ln: '19', text: `  res.json({ token });` },
                { t: 'add', ln: '20', text: `});` },
                { t: 'add', ln: '21', text: `` },
                { t: 'add', ln: '22', text: `app.get('/me', requireAuth, (req, res) => {` },
                { t: 'add', ln: '23', text: `  res.json({ user: req.user });` },
                { t: 'add', ln: '24', text: `});` }
            ]
        }
    },
    {
        id: 7,
        type: 'terminal',
        icon: 'ai-terminal',
        kind: 'terminal',
        label: 'Shell',
        title: 'Running tests',
        time: '1:15',
        content: {
            cwd: '~/project',
            lines: [
                { t: 'cmd', text: 'npm test' },
                { t: 'dim', text: '' },
                { t: 'dim', text: '> project@1.0.0 test' },
                { t: 'dim', text: '> jest --coverage' },
                { t: 'dim', text: '' },
                { t: 'warn', text: 'FAIL  src/auth/jwt.test.ts' },
                { t: 'err', text: '  ● signToken › should produce a verifiable token' },
                { t: 'err', text: '' },
                { t: 'err', text: '    expect(received).toBe(expected)' },
                { t: 'err', text: `    Expected: "test@example.com"` },
                { t: 'err', text: `    Received: undefined` },
                { t: 'dim', text: '' },
                { t: 'ok', text: 'PASS  src/index.test.ts' },
                { t: 'dim', text: '' },
                { t: 'dim', text: 'Tests: 1 failed, 3 passed, 4 total' }
            ]
        }
    },
    {
        id: 8,
        type: 'diff',
        icon: 'ai-diff',
        kind: 'diff',
        label: 'File Modified',
        title: 'Fixing failing test in jwt.ts',
        time: '1:29',
        content: {
            filename: 'src/auth/jwt.ts',
            added: 2,
            removed: 2,
            lines: [
                {
                    t: 'ctx',
                    ln: '15',
                    text: `export function verifyToken(token: string): TokenPayload {`
                },
                { t: 'del', ln: '16', text: `  return jwt.verify(token, SECRET) as TokenPayload;` },
                {
                    t: 'add',
                    ln: '16',
                    text: `  const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;`
                },
                {
                    t: 'add',
                    ln: '17',
                    text: `  return { userId: decoded['userId'], email: decoded['email'], role: decoded['role'] };`
                },
                { t: 'ctx', ln: '18', text: `}` }
            ]
        }
    },
    {
        id: 9,
        type: 'terminal',
        icon: 'ai-terminal',
        kind: 'terminal',
        label: 'Shell',
        title: 'Final build — all tests pass',
        time: '1:44',
        content: {
            cwd: '~/project',
            lines: [
                { t: 'cmd', text: 'npm test && npm run build' },
                { t: 'dim', text: '' },
                { t: 'ok', text: 'PASS  src/auth/jwt.test.ts' },
                { t: 'ok', text: 'PASS  src/index.test.ts' },
                { t: 'dim', text: '' },
                { t: 'ok', text: 'Tests: 4 passed, 4 total' },
                { t: 'ok', text: 'Coverage: 91.3%' },
                { t: 'dim', text: '' },
                { t: 'dim', text: '> project@1.0.0 build' },
                { t: 'dim', text: '> tsc --outDir dist' },
                { t: 'dim', text: '' },
                { t: 'ok', text: 'Build complete → dist/' }
            ]
        }
    }
];

interface TypeInfo {
    icon: string;
    label: string;
}

interface TypeStyle {
    bg: string;
    text: string;
}

export const TYPE_CONFIG: Record<ActionType, TypeInfo> = {
    thought: { icon: '&#x1F9E0;', label: 'Reasoning' },
    read: { icon: '&#x1F4C4;', label: 'File Read' },
    terminal: { icon: '&#x25A0;', label: 'Shell' },
    file: { icon: '&#x2B;', label: 'File Created' },
    diff: { icon: '&#x2A57;', label: 'Diff' }
};

export const TYPE_STYLES: Record<ActionType, TypeStyle> = {
    thought: { bg: 'bg-agent-purple-bg', text: 'text-agent-purple' },
    read: { bg: 'bg-agent-orange-bg', text: 'text-agent-orange' },
    terminal: { bg: 'bg-agent-green-bg', text: 'text-agent-green' },
    file: { bg: 'bg-agent-yellow-bg', text: 'text-agent-yellow' },
    diff: { bg: 'bg-agent-blue-bg', text: 'text-agent-blue' }
};

export const KIND_COLORS: Record<string, string> = {
    thought: 'text-agent-purple',
    read: 'text-agent-orange',
    terminal: 'text-agent-green',
    file: 'text-agent-yellow',
    diff: 'text-agent-blue'
};