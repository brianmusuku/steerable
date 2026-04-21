import { error } from '@sveltejs/kit';
import { generateVideoScript } from '$lib/ai_generator';

export const load = async ({ params, platform }: any) => {
	const { id } = params;

	if (!platform?.env?.MY_KV_STORE) {
		throw error(500, 'KV store not configured');
	}

	const reasoning_trace = await platform.env.MY_KV_STORE.get(id);

	if (!reasoning_trace) {
		throw error(404, 'Reasoning trace not found');
	}

	try {
		const narration = await generateVideoScript(reasoning_trace);
		if (!narration) {
			throw error(500, 'Failed to generate narration');
		}
		return {
			narration,
			id
		};
	} catch (e) {
		console.error('Error generating video script:', e);
		throw error(500, 'Internal server error during narration generation');
	}
};
