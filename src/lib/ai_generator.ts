// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

const FAST_MODEL = 'gemini-2.5-flash-lite';
const PREVIEW_MODEL = 'gemini-3-flash-preview';


/**
 * Generates an arbitrary HTML section using the Gemini API.
 * The generated content is restricted to HTML and Tailwind CSS classes only.
 *
 * @param {string} prompt - A description of the HTML section to generate (e.g., "a hero banner with a blue background").
 * @returns {Promise<string>} - The generated HTML string.
 */
export async function generateHtmlSection(prompt: string) {
	if (!GEMINI_API_KEY) {
		throw new Error('Gemini API key is not set in environment variables.');
	}

	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY
	});

	const fullPrompt = `
    Generate an arbitrary HTML section based on a random description.
    IMPORTANT RULES:
    - Output ONLY the HTML+tailwind code. Do NOT include any explanations, markdown, or additional text.
    - Use ONLY standard HTML tags and attributes.
    - Style the HTML exclusively using Tailwind CSS classes (assume Tailwind is included in the project).
    - Do NOT use inline styles, <style> tags, or any external CSS.
    - The output must be a valid, self-contained HTML section (e.g., <div>, <section>, etc.).
    - Make it responsive and modern-looking.
  `;

	const response = await ai.models.generateContent({
		model: PREVIEW_MODEL,
		contents: fullPrompt
	});

	const generatedHtml = response.text?.trim();
	return generatedHtml;
}



/**
 * Generates an theme names given HTML styling.
 *
 * @param {string} html - The HTML to analyze.
 * @returns {Promise<string[]>} - The generated theme names.
 */
export async function generateThemes(html: string) {
	if (!GEMINI_API_KEY) {
		throw new Error('Gemini API key is not set in environment variables.');
	}

	const ai = new GoogleGenAI({
		apiKey: GEMINI_API_KEY
	});

	const fullPrompt = `
    Generate a list of theme names for the following HTML styling.
    IMPORTANT RULES:
    - First theme should be for the current HTML styling, then the rest should be diverse alternatives.
    - The theme name should be one word with creative and descriptive names
	- Create 5 theme names.
	HTML: ${html}
  `;

	const response = await ai.models.generateContent({
		model: FAST_MODEL,
		contents: fullPrompt,
		config: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: 'OBJECT',
				properties: {
					themes: {
						type: 'ARRAY',
						items: {
							type: 'STRING'
						}
					}
				}
			}
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
