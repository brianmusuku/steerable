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


const prompt = `given the following log for an AI agent, please create a script where you walkthrough your actions, taking the persona someone explaining what he did. include into the "why" of the choices because we can see "what" changed through diffs. Try to identify and very briefly explain important things that the user should know about the actions the agent is taking. This will help the reader see loopholes, caveats or better ways to do things. the person consuming this will do it via a text to speech software so make sure your script is voice ready

[
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "text",
"text": "create a new frontend folder add a readme",
"author": "human"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "reasoning",
"text": "The user wants me to create a new folder called "frontend" and add a README file to it. Let me first check the current directory structure to understand what exists.",
"author": "ai"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "text",
"text": "\n\nI'll create the frontend folder and add a README file.",
"author": "ai"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "tool",
"status": "completed",
"toolcommand": "mkdir -p frontend",
"tooltype": "bash",
"toolcommandDescription": "Create frontend directory",
"toolTimeStartEnd": {
"start": 1775933733154,
"end": 1775933733179
},
"author": "ai"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "reasoning",
"text": "Now I need to write a README.md file in the frontend folder. Since the user didn't specify what should be in the README, I'll create a basic placeholder README.",
"author": "ai"
},
{
"type": "file.edited",
"properties": {
"file": "/home/brian/Downloads/thespian/frontend/README.md"
}
},
{
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/frontend/README.md",
"event": "add"
}
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "tool",
"status": "completed",
"tooltype": "write",
"toolTimeStartEnd": {
"start": 1775933735783,
"end": 1775933735800
},
"author": "ai"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "reasoning",
"text": "The task is now complete - I've created the frontend folder and a README.md file inside it.",
"author": "ai"
},
{
"sessionID": "ses_28219d492ffeWVFq286HOIbMvt",
"type": "text",
"text": "\n\nDone. Created frontend/ folder with README.md.",
"author": "ai"
}
]`