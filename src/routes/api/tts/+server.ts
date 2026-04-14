import { GEMINI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHash } from 'crypto';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// Cache directory for generated audio files
const CACHE_DIR = join(process.cwd(), 'static/audio/cache');

function getTextHash(text: string): string {
	return createHash('sha256').update(text).digest('hex').substring(0, 16);
}

function getCachePath(hash: string): string {
	return join(CACHE_DIR, `${hash}.wav`);
}

export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	if (!text || typeof text !== 'string') {
		return json({ error: 'Missing text parameter' }, { status: 400 });
	}

	const hash = getTextHash(text);
	const cachePath = getCachePath(hash);

	// Check disk cache first
	if (existsSync(cachePath)) {
		console.log('[TTS] Cache hit for hash:', hash);
		const wavBuffer = await readFile(cachePath);
		return new Response(wavBuffer, {
			headers: {
				'Content-Type': 'audio/wav',
				'Content-Length': wavBuffer.length.toString(),
				'X-TTS-Cache': 'hit'
			}
		});
	}

	console.log('[TTS] Cache miss — generating audio for hash:', hash, 'text length:', text.length);

	try {
		const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`;

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [
					{
						parts: [{ text: `Say the following text exactly as written, do not add anything:\n\n${text}` }]
					}
				],
				generationConfig: {
					responseModalities: ['AUDIO'],
					speechConfig: {
						voiceConfig: {
							prebuiltVoiceConfig: {
								voiceName: 'Kore'
							}
						}
					}
				}
			})
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error('[TTS] Gemini API error:', response.status, errText);
			return json({ error: `API error: ${response.status}`, details: errText }, { status: 500 });
		}

		const data = await response.json();

		const candidate = data.candidates?.[0];
		if (!candidate) {
			return json({ error: 'No candidates in response' }, { status: 500 });
		}

		const parts = candidate.content?.parts;
		if (!parts || parts.length === 0) {
			return json({ error: 'No parts in candidate' }, { status: 500 });
		}

		const audioPart = parts.find(
			(p: { inlineData?: { mimeType: string } }) =>
				p.inlineData?.mimeType?.startsWith('audio/')
		);

		if (audioPart?.inlineData) {
			const mimeType = audioPart.inlineData.mimeType;

			// Decode base64 PCM data
			const pcmBytes = Buffer.from(audioPart.inlineData.data, 'base64');

			// Parse sample rate from MIME type (e.g., "audio/L16;codec=pcm;rate=24000")
			const rateMatch = mimeType.match(/rate=(\d+)/);
			const sampleRate = rateMatch ? parseInt(rateMatch[1]) : 24000;
			const numChannels = 1;
			const bitsPerSample = 16;
			const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
			const blockAlign = numChannels * (bitsPerSample / 8);

			// Create WAV header (44 bytes)
			const wavHeader = Buffer.alloc(44);
			wavHeader.write('RIFF', 0);
			wavHeader.writeUInt32LE(36 + pcmBytes.length, 4);
			wavHeader.write('WAVE', 8);
			wavHeader.write('fmt ', 12);
			wavHeader.writeUInt32LE(16, 16);
			wavHeader.writeUInt16LE(1, 20);
			wavHeader.writeUInt16LE(numChannels, 22);
			wavHeader.writeUInt32LE(sampleRate, 24);
			wavHeader.writeUInt32LE(byteRate, 28);
			wavHeader.writeUInt16LE(blockAlign, 32);
			wavHeader.writeUInt16LE(bitsPerSample, 34);
			wavHeader.write('data', 36);
			wavHeader.writeUInt32LE(pcmBytes.length, 40);

			const wavBuffer = Buffer.concat([wavHeader, pcmBytes]);

			// Save to disk cache
			try {
				await mkdir(CACHE_DIR, { recursive: true });
				await writeFile(cachePath, wavBuffer);
				console.log('[TTS] Cached audio to:', cachePath);
			} catch (cacheErr) {
				console.warn('[TTS] Failed to cache audio:', cacheErr);
			}

			return new Response(wavBuffer, {
				headers: {
					'Content-Type': 'audio/wav',
					'Content-Length': wavBuffer.length.toString(),
					'X-TTS-Cache': 'miss'
				}
			});
		}

		console.error('[TTS] No audio part found.');
		return json({ error: 'No audio in response' }, { status: 500 });

	} catch (err) {
		console.error('[TTS] Exception:', err);
		return json({ error: 'TTS generation failed', details: String(err) }, { status: 500 });
	}
};
