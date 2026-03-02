import { getDraftState, getParticipants, getDraftedPlayersMap } from '$lib/server/draftQueries';

export function load() {
	return {
		serverState: getDraftState(),
		serverParticipants: getParticipants(),
		serverDraftedMap: getDraftedPlayersMap()
	};
}
