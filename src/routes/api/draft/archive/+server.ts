import { json } from '@sveltejs/kit';
import { archiveDraft } from '$lib/server/draftQueries';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	archiveDraft();
	return json({ ok: true });
};
