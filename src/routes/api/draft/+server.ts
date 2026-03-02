import { json } from '@sveltejs/kit';
import { getDraftState, getParticipants, getDraftedPlayersMap } from '$lib/server/draftQueries';

export function GET() {
	return json({
		state: getDraftState(),
		participants: getParticipants(),
		draftedMap: getDraftedPlayersMap()
	});
}
