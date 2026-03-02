import { json, error } from '@sveltejs/kit';
import { replaceAllParticipants } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { participants } = body;

	if (!Array.isArray(participants)) {
		error(400, 'participants must be an array');
	}

	replaceAllParticipants(participants);
	return json({ ok: true });
};
