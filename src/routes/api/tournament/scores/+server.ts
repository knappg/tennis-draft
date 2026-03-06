import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPlayerPoints } from '$lib/server/draftQueries';

export const GET: RequestHandler = async ({ url }) => {
	const tournamentId = url.searchParams.get('tournamentId');

	if (!tournamentId) {
		error(400, 'Missing tournamentId query param');
	}

	const scores = getPlayerPoints(tournamentId);
	return json(scores);
};
