# Steerable

Turn any AI reasoning trace into a structured, narrated video — in under 30 seconds.

Steerable converts code diffs into explainer videos using AI narration. Works with Claude, OpenAI o1, DeepSeek R1, Gemini, and more.

## Overview

Steerable is a web application that transforms AI coding agent traces into watchable video explanations. The platform:

- Parses code diffs and agent reasoning traces
- Generates AI-powered narration scripts
- Renders visual representations of file changes, terminal output, and code modifications
- Produces shareable video links

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 5
- **Deployment**: Cloudflare Workers (via `@sveltejs/adapter-cloudflare`)
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini API
- **TTS**: Kokoro TTS service
- **Animation**: GSAP
- **3D**: Three.js (for video preview effects)
- **Testing**: Playwright (E2E)
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── agent-trace/     # Agent trace visualization components
│   │   │   ├── AgentTrace.svelte
│   │   │   ├── Stage.svelte
│   │   │   ├── Timeline.svelte
│   │   │   ├── DiffView.svelte
│   │   │   ├── FileView.svelte
│   │   │   ├── TerminalBlock.svelte
│   │   │   └── ...
│   │   └── ui/              # Reusable UI components
│   │       ├── button/
│   │       ├── input/
│   │       ├── select/
│   │       ├── sheet/
│   │       └── ...
│   ├── data/
│   │   └── action.ts        # Action type definitions and sample data
│   ├── types/
│   │   └── action.ts        # TypeScript interfaces for actions
│   └── ai_generator.ts      # Gemini AI script generation
├── routes/
│   ├── +page.svelte         # Landing page
│   ├── +layout.svelte       # Root layout
│   ├── app/
│   │   ├── +page.svelte     # App dashboard
│   │   └── [id]/
│   │       └── +page.svelte # Video player page
│   ├── watch/
│   │   ├── +page.svelte     # Watch list
│   │   └── [id]/
│   │       └── +page.svelte # Standalone video viewer
│   └── api/
│       ├── narration/       # AI narration generation
│       ├── tts/             # TTS endpoint
│       ├── tts-kokoro/      # Kokoro TTS integration
│       ├── diff/            # Diff analysis
│       └── data/            # Data persistence
└── app.css                  # Global styles
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm check

# Watch mode for type checking
pnpm check:watch

# Format code
pnpm format

# Lint code
pnpm lint
```

### Testing

```bash
# Run E2E tests
pnpm test:e2e

# Or just
pnpm test
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deployment

Deploy to Cloudflare:

```bash
pnpm deploy
```

## Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Features

### Landing Page
- Animated terminal/video preview
- Pricing tiers (Explorer, Coder, Reel)
- Integration showcase (OpenCode, Claude code, Cursor, VS Code)
- Smooth scroll navigation

### Video Player
- Agent trace visualization with timeline
- Multiple action types:
  - **File Read**: Syntax-highlighted code display
  - **Terminal**: Command output with styling
  - **File Created**: New file content display
  - **Diff**: Side-by-side or unified diff view
- Stage-based narration playback
- Text-to-speech integration (Kokoro)

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/narration` | POST | Generate AI narration script from diff |
| `/api/tts` | POST | Text-to-speech synthesis |
| `/api/tts-kokoro` | POST | Kokoro TTS batch processing |
| `/api/diff` | GET/POST | Diff analysis and storage |
| `/api/data` | GET/POST | Video data management |

## Action Types

The application supports five types of agent actions:

| Type | Icon | Description |
|------|------|-------------|
| `thought` | 🤜 | Reasoning/chain-of-thought |
| `read` | 📄 | File read operation |
| `terminal` | ▶ | Shell command execution |
| `file` | ➤ | File creation |
| `diff` | ✧ | Code modification |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm check` | Type checking |
| `pnpm format` | Format with Prettier |
| `pnpm lint` | Lint with ESLint |
| `pnpm test:e2e` | Run Playwright tests |
| `pnpm deploy` | Deploy to Cloudflare |

## License

This project uses the `steerable` npm package for CLI functionality. See [npmjs.com/package/steerable](https://www.npmjs.com/package/steerable) for more information.