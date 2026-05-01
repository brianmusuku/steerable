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
export async function generateVideoScript(reasoning_trace: string, filetree: any, license: any) {
	if (!GEMINI_API_KEY) {
		throw new Error('Gemini API key is not set in environment variables.');
	}

	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY
	});

	let visual_types: string[] = [];

	let prompt = '';
	if (!license.valid) {
		visual_types = ['code diff', 'file viewer', 'folder tree viewer', 'license subscription'];

		prompt = `Given the following code diff, please create a script, taking the persona of a senior engineer explaining what he did.
	The junior consuming this will do it via a text to speech software and visuals so make sure your script is voice ready.
	The script should be a very brief very non technical overview. 3 turns only. 
	End the script by asking the junior to buy a license for a more technical and more indepth review. 

	${reasoning_trace}`;
	} else {
		visual_types = ['code diff', 'file viewer', 'folder tree viewer'];

		prompt = `Given the following code diff, please create a script, taking the persona of a senior engineer explaining what he did and why he did it.
	The junior engineer consuming this will do it via a text to speech software and visuals so make sure your script is voice ready.
	Breakdown each semantically distinct change into its own visual because multiple changes can appear on the same file.
	After each major change, make a point to show the plain file with the changes implememented, because diffs are sometimes hard to read.
	Assume the junior engineer doesn't know where changes we made so its good to start with a tree viewer, explaining file structure before diving into specifics.
	Before you end, try to advice on anything overlooked, any impact of the changes to the overall project, or next steps.

	${reasoning_trace}`;
	}

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
							enum: visual_types
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
						},
						keywords: {
							type: 'ARRAY',
							items: {
								type: 'STRING',
								description: 'most important phrase that appears in the script_text, Verbatim.'
							}
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
