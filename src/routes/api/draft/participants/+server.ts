import { json, error } from '@sveltejs/kit';
import { upsertParticipant, getParticipants } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { id, name, teamName, icon } = body;

	if (!id || !name || !teamName || !icon) {
		error(400, 'Missing required fields: id, name, teamName, icon');
	}

	const existing = getParticipants();
	const sortOrder = existing.length;
	upsertParticipant({ id, name, teamName, icon }, sortOrder);

	return json({ ok: true });
};
