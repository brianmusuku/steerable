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

	const cacheKey = `narration:${id}`;
	const cachedNarration = await platform.env.MY_KV_STORE.get(cacheKey);

	if (cachedNarration) {
		try {
			return {
				narration: JSON.parse(cachedNarration),
				id
			};
		} catch (e) {
			console.error('Error parsing cached narration:', e);
		}
	}

	return {
		narration: null,
		id
	};
};
