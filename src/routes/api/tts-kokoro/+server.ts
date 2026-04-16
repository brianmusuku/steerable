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

function getMetaCachePath(hash: string): string {
	return join(CACHE_DIR, `${hash}.meta.json`);
}

async function ensureCacheDir() {
	try {
		await mkdir(CACHE_DIR, { recursive: true });
	} catch (_) { }
}

interface KokoroMeta {
	timestamps: any;
	duration: number;
}

/**
 * Fetch audio + metadata from the Kokoro backend.
 * The backend now returns JSON: { audio: base64, timestamps: [...], duration: float }
 */
async function fetchFromBackend(
	text: string,
	voice: string,
	hash: string
): Promise<{ buffer: Buffer; meta: KokoroMeta } | null> {
	console.log(`[Kokoro TTS] Generating: ${hash} (${text.substring(0, 50)}…)`);

	const res = await fetch(KOKORO_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text, voice })
	});

	if (!res.ok) {
		const msg = await res.text();
		console.error(`[Kokoro TTS] Error for ${hash}: HTTP ${res.status} ${msg}`);
		return null;
	}

	const payload = await res.json();
	const { audio: audioB64, timestamps, duration } = payload;

	const buffer = Buffer.from(audioB64, 'base64');
	const meta: KokoroMeta = { timestamps, duration };

	// Persist both the wav and the metadata
	await writeFile(getCachePath(hash), buffer);
	await writeFile(getMetaCachePath(hash), JSON.stringify(meta));
	console.log(`[Kokoro TTS] Generated & cached: ${hash}`);

	return { buffer, meta };
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
		const results: { hash: string; cached: boolean; timestamps?: any; duration?: number }[] = [];

		for (const text of body.texts as string[]) {
			if (!text.trim()) continue;

			const hash = getHash(text, voice);
			const cachePath = getCachePath(hash);
			const metaPath = getMetaCachePath(hash);

			if (existsSync(cachePath) && existsSync(metaPath)) {
				console.log(`[Kokoro TTS] Cache hit: ${hash}`);
				const meta: KokoroMeta = JSON.parse(await readFile(metaPath, 'utf-8'));
				results.push({ hash, cached: true, timestamps: meta.timestamps, duration: meta.duration });
				continue;
			}

			try {
				const result = await fetchFromBackend(text, voice, hash);
				if (result) {
					results.push({
						hash,
						cached: false,
						timestamps: result.meta.timestamps,
						duration: result.meta.duration
					});
				}
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
		const metaPath = getMetaCachePath(hash);

		// Serve from cache
		if (existsSync(cachePath) && existsSync(metaPath)) {
			console.log(`[Kokoro TTS] Cache hit: ${hash}`);
			const buffer = await readFile(cachePath);
			const meta: KokoroMeta = JSON.parse(await readFile(metaPath, 'utf-8'));
			const audioB64 = buffer.toString('base64');

			return json({
				audio: audioB64,
				timestamps: meta.timestamps,
				duration: meta.duration,
				hash,
				cached: true
			});
		}

		// Generate fresh
		try {
			const result = await fetchFromBackend(text, voice, hash);
			if (!result) {
				return json({ error: 'Kokoro backend returned an error' }, { status: 500 });
			}

			const audioB64 = result.buffer.toString('base64');
			return json({
				audio: audioB64,
				timestamps: result.meta.timestamps,
				duration: result.meta.duration,
				hash,
				cached: false
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

	// Also include timestamps/duration if metadata exists
	const metaPath = getMetaCachePath(hash);
	if (existsSync(metaPath)) {
		const meta: KokoroMeta = JSON.parse(await readFile(metaPath, 'utf-8'));
		const audioB64 = buffer.toString('base64');
		return json({
			audio: audioB64,
			timestamps: meta.timestamps,
			duration: meta.duration,
			hash
		});
	}

	// Fallback: return raw audio if no metadata (legacy cached files)
	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'audio/wav',
			'Content-Length': buffer.length.toString(),
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
