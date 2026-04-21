// src/routes/api/data/+server.js
import { json } from '@sveltejs/kit';
import { verifyGumroadLicense } from '$lib/utils/verify';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
  const { licenseKey } = await request.json();
  const license = await verifyGumroadLicense(licenseKey);
  if (!license.valid) {
    return json({ error: 'Invalid license key' }, { status: 400 });
  }

  const uuid = crypto.randomUUID();

  try {
    const { datastring } = await request.json();

    if (!datastring) {
      return json({ error: 'Missing datastring' }, { status: 400 });
    }

    //  Ensure platform exists (it won't during local 'npm run dev' without wrangler)
    if (!platform?.env?.MY_KV_STORE) {
      return json({ error: 'KV storage not found' }, { status: 500 });
    }
    await platform.env.MY_KV_STORE.put(uuid, datastring);

    return json({ uuid });

  } catch (error) {
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}