// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';
import { Description } from './components/ui/empty';

const SFAST_MODEL = 'gemini-3.1-flash-lite-preview';
const FAST_MODEL = 'gemini-3-flash-preview';

/**
 * Generates an agent walkthrough video script.
 *
 * @param {string} html - The HTML to analyze.
 * @returns {Promise<string[]>} - The generated theme names.
 */
export async function generateVideoScript(reasoning_trace: string, filetree: JSON) {
	if (!GEMINI_API_KEY) {
		throw new Error('Gemini API key is not set in environment variables.');
	}

	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY
	});

	const prompt = `Given the following code diff, please create a script, taking the persona of a senior engineer explaining what he did and why he did it.
	The junior engineer consuming this will do it via a text to speech software and visuals so make sure your script is voice ready. To create a mental map 
	for the junior engineer, start with a quick overview before diving into specifics.
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
						agents_output: {
							type: 'STRING',
							description:
								'The whole diff highlighted on the lines that you are currently explaining.'
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
						'agents_output',
						'script_text_3word_phrase_where_visual_starts'
					],
					required: [
						'script_text',
						'visual',
						'title',
						'filename',
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
		parsed.filetree = filetree;
		return parsed;
	} catch (e) {
		console.error('Failed to parse narration JSON', e);
		return null;
	}
}
