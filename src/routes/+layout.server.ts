import {
	getDraftState,
	getParticipants,
	getDraftedPlayersMap,
	getTournamentById,
	getTournamentPlayers
} from '$lib/server/draftQueries';
import { loadStaticDrawIfPresent } from '$lib/server/syncService';
import { TENNIS_PLAYERS } from '$lib/data/players';

export function load() {
	const serverState = getDraftState();
	const { tournamentId, wtaTournamentId } = serverState;

	// Self-populate the draft pool from any committed static draw (e.g. Wimbledon 2026)
	// for the active tournaments. Idempotent; ensures a fresh DB (incl. the production
	// server) is seeded purely from the committed file, with no manual import step.
	if (tournamentId) loadStaticDrawIfPresent(tournamentId);
	if (wtaTournamentId) loadStaticDrawIfPresent(wtaTournamentId);

	const serverParticipants = getParticipants(tournamentId);
	const serverDraftedMap = getDraftedPlayersMap(tournamentId);

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
