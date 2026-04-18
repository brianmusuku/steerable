import { ELEVEN_LABS_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ELEVEN_LABS_VOICE_ID = 'cjVigY5qzO86Huf0OWal';
const ELEVEN_LABS_MODEL_ID = 'eleven_flash_v2_5';

async function generateElevenLabsNotification(
	texts: string[]
): Promise<{ audio_base64: string; timestamps: number[] } | null> {
	if (!ELEVEN_LABS_KEY) return null;

	const joinedText = texts.join('\n\n');

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
		const alignment = data.alignment;

		// Calculate timestamps for each text chunk
		const timestamps: number[] = [0];
		let searchIndex = 0;

		for (let i = 1; i < texts.length; i++) {
			const previousTotalLength = texts.slice(0, i).join('\n\n').length + 2;

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
				const lastTime = timestamps[timestamps.length - 1];
				timestamps.push(lastTime + 5.0);
			}
		}

		return { audio_base64: data.audio_base64, timestamps };
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
		const result = await generateElevenLabsNotification(texts);
		if (result) {
			return json(result);
		}
		return json({ error: 'Generation failed' }, { status: 500 });
	}

	// Single request mode
	if (text && typeof text === 'string') {
		const result = await generateElevenLabsNotification([text]);
		if (result) {
			return json(result);
		}
		return json({ error: 'Generation failed' }, { status: 500 });
	}

	return json({ error: 'Invalid input' }, { status: 400 });
};
