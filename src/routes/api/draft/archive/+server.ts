import { json, error } from '@sveltejs/kit';
import { archiveDraft } from '$lib/server/draftQueries';
import { config } from '$lib/server/config';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { password } = body as { password: string };

	if (!config.syncPassword) {
		error(500, 'SYNC_PASSWORD is not configured on the server');
	}
	if (password !== config.syncPassword) {
		error(403, 'Incorrect password');
	}

	archiveDraft();
	return json({ ok: true });
};
