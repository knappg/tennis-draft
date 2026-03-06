import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getTournamentById,
	upsertTournament,
	setActiveTournament,
	getTournamentPlayers
} from '$lib/server/draftQueries';
import { TOURNAMENT_CATALOG, makeTournamentId, getWtaCounterpart } from '$lib/data/tournaments';
import type { Tournament } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { catalogId, year } = body as { catalogId: string; year: number };

	if (!catalogId || !year) {
		error(400, 'Missing catalogId or year');
	}

	const entry = TOURNAMENT_CATALOG.find(e => e.id === catalogId);
	if (!entry) {
		error(400, `Unknown tournament catalogId: ${catalogId}`);
	}

	const atpId = makeTournamentId(catalogId, year, 'atp');
	const wtaId = getWtaCounterpart(atpId);

	// Create tournament records if they don't already exist
	const atpBase: Tournament = {
		id: atpId,
		name: entry.name,
		year,
		gender: 'atp',
		tourType: entry.tourType,
		startDate: null,
		endDate: null,
		status: 'upcoming',
		apiId: entry.apiAtpId != null ? String(entry.apiAtpId) : null,
		lastSyncedAt: null
	};
	const wtaBase: Tournament = {
		id: wtaId,
		name: entry.name,
		year,
		gender: 'wta',
		tourType: entry.tourType,
		startDate: null,
		endDate: null,
		status: 'upcoming',
		apiId: entry.apiWtaId != null ? String(entry.apiWtaId) : null,
		lastSyncedAt: null
	};

	// Preserve existing status but always apply catalog apiId
	const existingAtp = getTournamentById(atpId);
	const existingWta = getTournamentById(wtaId);

	upsertTournament(existingAtp ? { ...existingAtp, apiId: atpBase.apiId } : atpBase);
	upsertTournament(existingWta ? { ...existingWta, apiId: wtaBase.apiId } : wtaBase);

	setActiveTournament(atpId, wtaId);

	const atpTournament = getTournamentById(atpId)!;
	const wtaTournament = getTournamentById(wtaId)!;
	const atpPlayers = getTournamentPlayers(atpId, 'atp');
	const wtaPlayers = getTournamentPlayers(wtaId, 'wta');

	return json({ atpTournament, wtaTournament, atpPlayers, wtaPlayers });
};
