// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY, GUMROAD_PRODUCT_ID } from '$env/static/private';

const VFAST_MODEL = 'gemini-3-flash-lite';
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

	const prompt = `given the following log for an AI agent, please create a script where you walk-through your actions, taking the persona of someone explaining what he did. Delve into the "why" of the choices because we can see "what" changed through diffs. The person consuming this will do it via a text to speech software and programmatic visuals so make sure your script is voice ready. Interleave the script with instruction text between [ and ] for all visual components we will show as the TTS is running. file tree structure should remain as is. agents_output is the string that performs the agent's action e.g. command, file content or file diff.
	${reasoning_trace}`

	const responseSchema = {
		type: "OBJECT",
		properties: {
			content: {
				type: "ARRAY",
				items: {
					type: "OBJECT",
					properties: {
						script_text: {
							type: "STRING"
						},
						visual: {
							type: "STRING",
							enum: [
								"code diff",
								"file viewer",
								"folder tree viewer",
								"command line shell"
							]
						},
						title: {
							type: "STRING"
						},
						filename: {
							type: "STRING"
						},
						filetree: {
							type: "STRING"
						},
						agents_output: {
							type: "STRING"
						},
						script_text_3word_phrase_where_visual_starts: {
							type: "STRING"
						}
					},
					propertyOrdering: [
						"script_text",
						"visual",
						"title",
						"filename",
						"filetree",
						"agents_output",
						"script_text_3word_phrase_where_visual_starts"
					],
					required: [
						"script_text",
						"visual",
						"title",
						"filename",
						"filetree",
						"agents_output",
						"script_text_3word_phrase_where_visual_starts"
					]
				}
			},
			one_sentence_1st_person_summary: {
				type: "STRING"
			}
		},
		propertyOrdering: [
			"content",
			"one_sentence_1st_person_summary"
		],
		required: [
			"content",
			"one_sentence_1st_person_summary"
		]
	}
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
		return parsed.themes || [];
	} catch (e) {
		console.error('Failed to parse themes JSON', e);
		return [];
	}
}

/**
 * Verifies a Gumroad license key.
 * 
 * @param {string} licenseKey - The license key to verify.
 * @returns {Promise<{valid: boolean, purchase?: any, message?: string}>}
 */
export async function verifyGumroadLicense(licenseKey: string) {

	try {
		const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				product_id: GUMROAD_PRODUCT_ID,
				license_key: licenseKey
			})
		});

		const data = await response.json();

		if (data.success && data.purchase && !data.purchase.refunded && !data.purchase.chargeback) {
			return {
				valid: true,
				purchase: data.purchase
			};
		}

		return {
			valid: false,
			message: data.message || 'Invalid or inactive license key.'
		};
	} catch (error) {
		console.error('Error verifying Gumroad license:', error);
		return {
			valid: false,
			message: 'Verification failed. Please try again later.'
		};
	}
}


