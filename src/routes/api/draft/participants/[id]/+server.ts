import { json } from '@sveltejs/kit';
import { deleteParticipant } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = ({ params }) => {
	deleteParticipant(params.id);
	return json({ ok: true });
};
