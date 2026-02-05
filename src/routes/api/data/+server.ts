// src/routes/api/generate-html/+server.js

import { generateHtmlSection } from '$lib/ai_generator';
import { json } from '@sveltejs/kit';

const ENDPOINT = 'https://estk5ogfb4.execute-api.us-east-1.amazonaws.com/Prod/'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { prompt } = await request.json();

  if (!prompt) {
    return json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const html = await generateHtmlSection(prompt);
    return json({ html });
  } catch (error) {
    return json({ error }, { status: 500 });
  }
}
