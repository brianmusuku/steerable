// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

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
    - Output ONLY the HTML code. Do NOT include any explanations, markdown, or additional text.
    - Use ONLY standard HTML tags and attributes. Only black and white colors.
    - Style the HTML exclusively using Tailwind CSS classes (assume Tailwind is included in the project).
    - Do NOT use inline styles, <style> tags, or any external CSS.
    - The output must be a valid, self-contained HTML section (e.g., <div>, <section>, etc.).
    - Make it responsive and modern-looking.
  `;

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: fullPrompt
	});

	const generatedHtml = response.text?.trim();
	return generatedHtml;
}
