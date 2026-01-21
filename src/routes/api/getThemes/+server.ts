// src/routes/api/generate-html/+server.js

import { generateThemes } from '$lib/generator';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { prompt } = await request.json();

    if (!prompt) {
        return json({ error: 'Prompt is required' }, { status: 400 });
    }

    try {
        const themes = await generateThemes(prompt);
        return json({ themes });
    } catch (error) {
        return json({ error }, { status: 500 });
    }
}
