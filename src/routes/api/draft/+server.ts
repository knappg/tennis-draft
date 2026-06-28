import { json } from '@sveltejs/kit';
import { getDraftState, getParticipants, getDraftedPlayersMap } from '$lib/server/draftQueries';

export function GET() {
	const state = getDraftState();
	// Participants' picks and the drafted map are tournament-scoped, so pass the
	// active tournament id (mirrors +layout.server.ts) — otherwise picks come back empty.
	return json({
		state,
		participants: getParticipants(state.tournamentId),
		draftedMap: getDraftedPlayersMap(state.tournamentId)
	});
}
