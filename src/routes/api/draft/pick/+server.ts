import { json, error } from '@sveltejs/kit';
import { applyPick } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { tennisPlayerId, participantId, pickIndex, newState } = body;

	if (!tennisPlayerId || !participantId || pickIndex == null || !newState) {
		error(400, 'Missing required fields');
	}

	applyPick(tennisPlayerId, participantId, pickIndex, newState);
	return json({ ok: true });
};
