import { json } from '@sveltejs/kit';
import { verifyGumroadLicense } from '$lib/utils/verify';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const { licenseKey, traces } = await request.json();

		if (!licenseKey) {
			return json({ error: 'License key is required' }, { status: 400 });
		}

		if (!traces) {
			return json({ error: 'Missing traces' }, { status: 400 });
		}

		const license = await verifyGumroadLicense(licenseKey);
		if (!license.valid) {
			return json({ error: license.message || 'Invalid license key' }, { status: 401 });
		}

		// Ensure platform exists (Cloudflare Workers/Pages environment)
		if (!platform?.env?.MY_KV_STORE) {
			console.error('KV storage "MY_KV_STORE" is not configured');
			return json({ error: 'Server configuration error' }, { status: 500 });
		}

		const uuid = crypto.randomUUID();
		
		// Store traces in KV. If traces is an object, stringify it.
		const value = typeof traces === 'string' ? traces : JSON.stringify(traces);
		await platform.env.MY_KV_STORE.put(uuid, value);

		return json({ uuid, success: true });
	} catch (error) {
		console.error('API Error in /api/data:', error);
		const message = error instanceof Error ? error.message : 'Internal Server Error';
		return json({ error: message }, { status: 500 });
	}
};