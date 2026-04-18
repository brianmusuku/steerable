import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const KOKORO_ENDPOINT = 'https://findmjuaji--kokoro-api-pipeline-ttsservice-tts-api.modal.run';

/**
 * Fetch audio + metadata from the Kokoro backend.
 * No server-side caching as requested.
 */
async function fetchFromBackend(
	text: string,
	voice: string
): Promise<{ audio: string; timestamps: any; duration: number } | null> {
	const res = await fetch(KOKORO_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text, voice })
	});

	if (!res.ok) {
		const msg = await res.text();
		console.error(`[Kokoro TTS] Error: HTTP ${res.status} ${msg}`);
		return null;
	}

	return await res.json();
}

/**
 * POST /api/tts-kokoro
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const voice = body.voice ?? 'am_echo';

	// ── Batch mode ──────────────────────────────────────────────────────
	if (Array.isArray(body.texts) && body.texts.length > 0) {
		const results: any[] = [];

		for (const text of body.texts as string[]) {
			if (!text.trim()) continue;
			try {
				const result = await fetchFromBackend(text, voice);
				if (result) {
					results.push({
						...result,
						text
					});
				}
			} catch (err) {
				console.error(`[Kokoro TTS] Exception:`, err);
			}
		}

		return json({ results });
	}

	// ── Single mode ─────────────────────────────────────────────────────
	if (body.text && typeof body.text === 'string') {
		try {
			const result = await fetchFromBackend(body.text, voice);
			if (!result) {
				return json({ error: 'Kokoro backend returned an error' }, { status: 500 });
			}
			return json(result);
		} catch (err: any) {
			console.error(`[Kokoro TTS] Exception:`, err);
			return json({ error: err.message }, { status: 500 });
		}
	}

	return json({ error: 'Invalid input. Provide { text } or { texts }.' }, { status: 400 });
};
