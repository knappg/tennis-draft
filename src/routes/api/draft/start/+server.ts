import { json, error } from '@sveltejs/kit';
import { saveDraftState } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { state } = body;

	if (!state) {
		error(400, 'Missing state');
	}

	saveDraftState(state);
	return json({ ok: true });
};
