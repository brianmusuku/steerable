// src/routes/api/generate-html/+server.js

import { json } from '@sveltejs/kit';
import { buildRandomHTML } from '$lib/randomgen';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { prompt } = await request.json();

	if (!prompt) {
		return json({ error: 'Prompt is required' }, { status: 400 });
	}

	try {
		const html = buildRandomHTML({ maxDepth: 2 });
		return json({ html });
	} catch (error) {
		return json({ error }, { status: 500 });
	}
}
