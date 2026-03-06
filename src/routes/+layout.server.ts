import {
	getDraftState,
	getParticipants,
	getDraftedPlayersMap,
	getTournamentById,
	getTournamentPlayers
} from '$lib/server/draftQueries';
import { TENNIS_PLAYERS } from '$lib/data/players';

export function load() {
	const serverState = getDraftState();
	const serverParticipants = getParticipants();
	const serverDraftedMap = getDraftedPlayersMap();

	const { tournamentId, wtaTournamentId } = serverState;

	// ATP players: use tournament_players if populated, else fall back to static list
	const dbAtpPlayers = tournamentId ? getTournamentPlayers(tournamentId, 'atp') : [];
	const serverPlayers = dbAtpPlayers.length > 0 ? dbAtpPlayers : TENNIS_PLAYERS;

	// WTA players: only available when a WTA tournament is configured and synced
	const serverWtaPlayers = wtaTournamentId ? getTournamentPlayers(wtaTournamentId, 'wta') : [];

	// Active ATP tournament metadata (used for polling, status display)
	const serverTournament = tournamentId ? getTournamentById(tournamentId) : null;

	return {
		serverState,
		serverParticipants,
		serverDraftedMap,
		serverPlayers,
		serverWtaPlayers,
		serverTournament
	};
}
