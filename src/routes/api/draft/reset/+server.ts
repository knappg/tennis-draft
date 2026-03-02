import { json } from '@sveltejs/kit';
import { resetAllDraftData } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	resetAllDraftData();
	return json({ ok: true });
};
