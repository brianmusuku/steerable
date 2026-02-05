// src/routes/api/generate-html/+server.js

import { ENDPOINT } from '$env/static/private';
import { generateHtmlSection } from '$lib/ai_generator';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { prompt } = await request.json();

  const response = await fetch(ENDPOINT, {
    method: 'GET',

  });
  const info = await response.json();

  try {
    const aiResponse = ""; //await generateHtmlSection(prompt);
    return json({
      info,
      aiResponse
    });
  } catch (error) {
    return json({ error }, { status: 500 });
  }
}
