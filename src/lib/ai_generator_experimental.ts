// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

const SFAST_MODEL = 'gemini-3.1-flash-lite-preview';
const FAST_MODEL = 'gemini-3-flash-preview';

/**
 * Generates an agent walkthrough video script.
 *
 * @param {string} html - The HTML to analyze.
 * @returns {Promise<string[]>} - The generated theme names.
 */
export async function generateVideoScript(reasoning_trace: string) {
	if (!GEMINI_API_KEY) {
		throw new Error('Gemini API key is not set in environment variables.');
	}

	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY
	});

	const prompt = `given the following diff, please create a script, taking the persona of someone explaining what he did and why he did it. The other person consuming this will do it via a text to speech software and visuals so make sure your script is voice ready. File tree structure JSON should be copied character for character, as is, no changes.
	${reasoning_trace}`;

	const responseSchema = {
		type: 'OBJECT',
		properties: {
			content: {
				type: 'ARRAY',
				items: {
					type: 'OBJECT',
					properties: {
						script_text: {
							type: 'STRING'
						},
						visual: {
							type: 'STRING',
							enum: ['code diff', 'file viewer', 'folder tree viewer', 'command line shell']
						},
						title: {
							type: 'STRING'
						},
						filename: {
							type: 'STRING'
						},
						filetree: {
							type: 'STRING'
						},
						agents_output: {
							type: 'STRING'
						},
						script_text_3word_phrase_where_visual_starts: {
							type: 'STRING'
						}
					},
					propertyOrdering: [
						'script_text',
						'visual',
						'title',
						'filename',
						'filetree',
						'agents_output',
						'script_text_3word_phrase_where_visual_starts'
					],
					required: [
						'script_text',
						'visual',
						'title',
						'filename',
						'filetree',
						'agents_output',
						'script_text_3word_phrase_where_visual_starts'
					]
				}
			},
			one_sentence_1st_person_summary: {
				type: 'STRING'
			}
		},
		propertyOrdering: ['content', 'one_sentence_1st_person_summary'],
		required: ['content', 'one_sentence_1st_person_summary']
	};
	const response = await ai.models.generateContent({
		model: FAST_MODEL,
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseSchema
		}
	});

	const generatedJson = response.text?.trim();
	if (!generatedJson) return [];

	try {
		const parsed = JSON.parse(generatedJson);
		return parsed;
	} catch (e) {
		console.error('Failed to parse narration JSON', e);
		return null;
	}
}
