// src/lib/gemini-html-generator.js

import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

const VFAST_MODEL = 'gemini-3-flash-lite';
const FAST_MODEL = 'gemini-3-flash-preview';




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

	const prompt = `given the following log for an AI agent, please create a script where you walk-through your actions, taking the persona of someone explaining what he did. Delve into the "why" of the choices because we can see "what" changed through diffs. The person consuming this will do it via a text to speech software and programmatic visuals so make sure your script is voice ready. Interleave the script with instruction text between [ and ] for all visual components we will show as the TTS is running. file tree structure should remain as is. agents_output is the string that performs the agent's action e.g. command, file content or file diff.

[
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "text",
"text": "in the readme, it should be svelte 5 not 5.1",
"author": "human"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "The user wants me to update the README to change "svelte 5.1" to "svelte 5". Let me first find and read the README file to see what it currently says.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "tool",
"status": "completed",
"tooltype": "glob",
"toolTimeStartEnd": {
"start": 1776251016245,
"end": 1776251016462
},
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "Let me read the README to find where it mentions Svelte 5.1.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "tool",
"status": "completed",
"tooltype": "grep",
"toolTimeStartEnd": {
"start": 1776251019346,
"end": 1776251019493
},
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "I found it in the frontend README at line 7. Let me fix it.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "tool",
"status": "error",
"error": "You must read file /home/brian/Downloads/thespian/frontend/README.md before overwriting it. Use the Read tool first",
"tooltype": "edit",
"toolTimeStartEnd": {
"start": 1776251023529,
"end": 1776251023538
},
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "I need to read the file first before editing it.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "tool",
"status": "completed",
"tooltype": "read",
"toolTimeStartEnd": {
"start": 1776251030194,
"end": 1776251030273
},
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "Now I can make the edit.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.edited",
"properties": {
"file": "/home/brian/Downloads/thespian/frontend/README.md"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/frontend/README.md",
"event": "change"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "tool",
"status": "completed",
"tooltype": "edit",
"toolTimeStartEnd": {
"start": 1776251038533,
"end": 1776251038540
},
"diff": {
"file": "/home/brian/Downloads/thespian/frontend/README.md",
"patch": "Index: /home/brian/Downloads/thespian/frontend/README.md\n===================================================================\n--- /home/brian/Downloads/thespian/frontend/README.md\n+++ /home/brian/Downloads/thespian/frontend/README.md\ n@ @ -3,6 +3,6 @@\n Frontend application for thespian project.\n \n ## Tech Stack\n \n-- Framework: Svelte 5.1\n+- Framework: Svelte 5\n - Database: PostgreSQL\n\ No newline at end of file\n",
"additions": 1,
"deletions": 1
},
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "reasoning",
"text": "Done! I updated the README to say Svelte 5 instead of Svelte 5.1.\n",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"sessionID": "ses_26f307eacffe0Od90widaEpIoV",
"type": "text",
"text": "\n\nDone. Updated "Svelte 5.1" to "Svelte 5" in the frontend README.",
"author": "ai"
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "add"
}
},
{
"fileTree": [
{
"name": "opencode.json",
"type": "file"
},
{
"name": "frontend",
"type": "folder",
"children": [
{
"name": "README.md",
"type": "file"
}
]
}
],
"type": "file.watcher.updated",
"properties": {
"file": "/home/brian/Downloads/thespian/.git/index.lock",
"event": "unlink"
}
}
]`

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
						visual_animation: {
							type: "STRING"
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
						}
					},
					propertyOrdering: [
						"script_text",
						"visual",
						"visual animation",
						"title",
						"filename",
						"filetree",
						"agents_output"
					],
					required: [
						"script_text",
						"visual",
						"visual animation",
						"title",
						"filename",
						"filetree",
						"agents_output"
					]
				}
			}
		},
		propertyOrdering: [
			"content"
		],
		required: [
			"content"
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


