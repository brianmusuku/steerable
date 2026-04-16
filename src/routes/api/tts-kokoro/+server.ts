import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHash } from 'crypto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const CACHE_DIR = join(process.cwd(), 'static/audio/kokoro-cache');
const KOKORO_ENDPOINT = 'https://findmjuaji--kokoro-api-pipeline-ttsservice-tts-api.modal.run';

function getHash(text: string, voice: string): string {
	return createHash('sha256').update(`${voice}:${text}`).digest('hex').substring(0, 16);
}

function getCachePath(hash: string): string {
	return join(CACHE_DIR, `${hash}.wav`);
}

async function ensureCacheDir() {
	try {
		await mkdir(CACHE_DIR, { recursive: true });
	} catch (_) { }
}

/**
 * POST /api/tts-kokoro
 *
 * Body options:
 *   { text: string, voice?: string }           — generate a single clip
 *   { texts: string[], voice?: string }         — batch-generate clips (returns hashes for each)
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const voice = body.voice ?? 'am_echo';

	await ensureCacheDir();

	// ── Batch mode ──────────────────────────────────────────────────────
	if (Array.isArray(body.texts) && body.texts.length > 0) {
		const results: { hash: string; cached: boolean }[] = [];

		for (const text of body.texts as string[]) {
			if (!text.trim()) continue;

			const hash = getHash(text, voice);
			const cachePath = getCachePath(hash);

			if (existsSync(cachePath)) {
				results.push({ hash, cached: true });
				console.log(`[Kokoro TTS] Cache hit: ${hash}`);
				continue;
			}

			// Generate from the endpoint
			try {
				console.log(`[Kokoro TTS] Generating: ${hash} (${text.substring(0, 50)}...)`);
				const res = await fetch(KOKORO_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ text, voice })
				});

				if (!res.ok) {
					const msg = await res.text();
					console.error(`[Kokoro TTS] Error for ${hash}: HTTP ${res.status} ${msg}`);
					continue;
				}

				const buffer = Buffer.from(await res.arrayBuffer());
				await writeFile(cachePath, buffer);
				results.push({ hash, cached: false });
				console.log(`[Kokoro TTS] Generated & cached: ${hash}`);
			} catch (err) {
				console.error(`[Kokoro TTS] Exception for ${hash}:`, err);
			}
		}

		return json({ results });
	}

	// ── Single mode ─────────────────────────────────────────────────────
	if (body.text && typeof body.text === 'string') {
		const text = body.text;
		const hash = getHash(text, voice);
		const cachePath = getCachePath(hash);

		if (existsSync(cachePath)) {
			console.log(`[Kokoro TTS] Cache hit: ${hash}`);
			const buffer = await readFile(cachePath);
			return new Response(new Uint8Array(buffer), {
				headers: {
					'Content-Type': 'audio/wav',
					'Content-Length': buffer.length.toString(),
					'X-TTS-Hash': hash,
					'X-TTS-Cached': 'true'
				}
			});
		}

		try {
			console.log(`[Kokoro TTS] Generating: ${hash}`);
			const res = await fetch(KOKORO_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, voice })
			});

			if (!res.ok) {
				const msg = await res.text();
				return json({ error: `Kokoro error: HTTP ${res.status}: ${msg}` }, { status: 500 });
			}

			const buffer = Buffer.from(await res.arrayBuffer());
			await writeFile(cachePath, buffer);

			return new Response(new Uint8Array(buffer), {
				headers: {
					'Content-Type': 'audio/wav',
					'Content-Length': buffer.length.toString(),
					'X-TTS-Hash': hash,
					'X-TTS-Cached': 'false'
				}
			});
		} catch (err: any) {
			console.error(`[Kokoro TTS] Exception:`, err);
			return json({ error: err.message }, { status: 500 });
		}
	}

	return json({ error: 'Invalid input. Provide { text } or { texts }.' }, { status: 400 });
};

/**
 * GET /api/tts-kokoro?hash=<hash>
 * 
 * Serve a cached file by its hash directly.
 */
export const GET: RequestHandler = async ({ url }) => {
	const hash = url.searchParams.get('hash');
	if (!hash) {
		return json({ error: 'Missing hash parameter' }, { status: 400 });
	}

	const cachePath = getCachePath(hash);
	if (!existsSync(cachePath)) {
		return json({ error: 'Not found in cache' }, { status: 404 });
	}

	const buffer = await readFile(cachePath);
	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'audio/wav',
			'Content-Length': buffer.length.toString(),
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
