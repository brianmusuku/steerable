import { json } from '@sveltejs/kit';
import { generateVideoScript } from '$lib/ai_generator_experimental';

export const POST = async ({ request, platform }: any) => {
	const { id } = await request.json();

	if (!platform?.env?.MY_KV_STORE) {
		return json({ error: 'KV store not configured' }, { status: 500 });
	}

	const cacheKey = `narration:${id}`;
	const cachedNarration = await platform.env.MY_KV_STORE.get(cacheKey);

	if (cachedNarration) {
		return json({ narration: JSON.parse(cachedNarration) });
	}

	const reasoning_trace = await platform.env.MY_KV_STORE.get(id);

	if (!reasoning_trace) {
		return json({ error: 'Reasoning trace not found' }, { status: 404 });
	}

	try {
		let filetree = JSON.parse(reasoning_trace).fileTree;

		const narration = await generateVideoScript(reasoning_trace, filetree);
		if (!narration) {
			return json({ error: 'Failed to generate narration' }, { status: 500 });
		}

		await platform.env.MY_KV_STORE.put(cacheKey, JSON.stringify(narration));

		return json({ narration });
	} catch (e) {
		console.error('Error generating video script:', e);
		return json({ error: 'Internal server error during narration generation' }, { status: 500 });
	}
};
