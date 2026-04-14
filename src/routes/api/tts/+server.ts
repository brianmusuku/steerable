import { ELEVEN_LABS_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHash } from 'crypto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const CACHE_DIR = join(process.cwd(), 'static/audio/cache');

function getTextHash(text: string): string {
	return createHash('sha256').update(text).digest('hex').substring(0, 16);
}

const ELEVEN_LABS_VOICE_ID = 'cjVigY5qzO86Huf0OWal';
const ELEVEN_LABS_MODEL_ID = 'eleven_flash_v2_5';

function getCachePath(hash: string): string {
	return join(CACHE_DIR, `${hash}.mp3`);
}

async function generateElevenLabsNotification(texts: string[]): Promise<{ buffer: Buffer; hash: string; timestamps: number[] } | null> {
	if (!ELEVEN_LABS_KEY) return null;

	const joinedText = texts.join('\n\n');
	const hash = getTextHash(joinedText);
	const cachePath = getCachePath(hash);
	const metaPath = cachePath.replace('.mp3', '.json');

	// Ensure cache directory exists
	try {
		await mkdir(CACHE_DIR, { recursive: true });
	} catch (e) { }

	// Check disk cache
	if (existsSync(cachePath) && existsSync(metaPath)) {
		const buffer = await readFile(cachePath);
		const meta = JSON.parse(await readFile(metaPath, 'utf-8'));
		console.log(`[TTS] Using cached audio for ${texts.length} items`);
		return { buffer, hash, timestamps: meta.timestamps };
	}

	try {
		const response = await fetch(
			`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}/with-timestamps`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'xi-api-key': ELEVEN_LABS_KEY
				},
				body: JSON.stringify({
					text: joinedText,
					model_id: ELEVEN_LABS_MODEL_ID,
					voice_settings: {
						stability: 0.5,
						similarity_boost: 0.5
					}
				})
			}
		);

		if (!response.ok) {
			const error = await response.text();
			console.error('[TTS] ElevenLabs error:', response.status, error);
			return null;
		}

		const data = await response.json();
		const audioBuffer = Buffer.from(data.audio_base64, 'base64');
		const alignment = data.alignment;

		// Calculate timestamps for each text chunk by searching for the start of each text block
		const timestamps: number[] = [0];
		let searchIndex = 0;

		// We skip the first one as it's at 0
		for (let i = 1; i < texts.length; i++) {
			// Estimate where the next block should start
			// ElevenLabs alignment indices follow the character positions in the combined text.
			// We join with \n\n which is 2 characters.
			const previousTotalLength = texts.slice(0, i).join('\n\n').length + 2;

			// Find the character index in the alignment data that corresponds to the start of this block
			// We search from where we left off
			let foundIndex = -1;
			for (let j = searchIndex; j < alignment.character_start_times_seconds.length; j++) {
				if (j >= previousTotalLength) {
					foundIndex = j;
					break;
				}
			}

			if (foundIndex !== -1) {
				timestamps.push(alignment.character_start_times_seconds[foundIndex]);
				searchIndex = foundIndex;
			} else {
				// Fallback: estimate based on previous + duration
				const lastTime = timestamps[timestamps.length - 1];
				timestamps.push(lastTime + 5.0); // Rough 5s fallback per block
			}
		}

		await writeFile(cachePath, audioBuffer);
		await writeFile(metaPath, JSON.stringify({ timestamps }));

		return { buffer: audioBuffer, hash, timestamps };
	} catch (err) {
		console.error('[TTS] ElevenLabs exception:', err);
		return null;
	}
}


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { text, texts } = body;

	// Batch request mode
	if (Array.isArray(texts) && texts.length > 0) {
		console.log(`[TTS] Generating audio with ElevenLabs...`);

		const result = await generateElevenLabsNotification(texts);
		if (result) {
			return json({
				hash: result.hash,
				timestamps: result.timestamps
			});
		}
		return json({ error: 'Generation failed' }, { status: 500 });
	}

	// Single request mode
	if (text && typeof text === 'string') {
		const result = await generateElevenLabsNotification([text]);
		if (result) {
			return new Response(new Uint8Array(result.buffer), {
				headers: {
					'Content-Type': 'audio/mpeg',
					'Content-Length': result.buffer.length.toString(),
					'X-TTS-Hash': result.hash
				}
			});
		}
		return json({ error: 'Generation failed' }, { status: 500 });
	}

	return json({ error: 'Invalid input' }, { status: 400 });
};
