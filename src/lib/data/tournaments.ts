export interface TournamentCatalogEntry {
	id: string; // e.g. 'ausopen'
	name: string;
	surface: string;
	tourType: 'slam' | 'masters1000';
	month: string; // display only
	apiAtpId?: number; // RapidAPI tournament season ID for ATP draw
	apiWtaId?: number; // RapidAPI tournament season ID for WTA draw
}

export const TOURNAMENT_CATALOG: TournamentCatalogEntry[] = [
	{
		id: 'ausopen',
		name: 'Australian Open',
		surface: 'Hard',
		tourType: 'slam',
		month: 'January',
		apiAtpId: 21305,
		apiWtaId: 16705
	},
	{
		id: 'indianwells',
		name: 'Indian Wells',
		surface: 'Hard',
		tourType: 'masters1000',
		month: 'March',
		apiAtpId: 21317,
		apiWtaId: 16714
	},
	{
		id: 'frenchopen',
		name: 'French Open',
		surface: 'Clay',
		tourType: 'slam',
		month: 'May–June',
		apiAtpId: 21329,
		apiWtaId: 16725
	},
	{
		id: 'wimbledon',
		name: 'Wimbledon',
		surface: 'Grass',
		tourType: 'slam',
		month: 'June–July',
		apiAtpId: 21337,
		apiWtaId: 16733
	},
	{
		id: 'usopen',
		name: 'US Open',
		surface: 'Hard',
		tourType: 'slam',
		month: 'August–September',
		apiAtpId: 21349,
		apiWtaId: 16743
	}
];

/** Build the DB primary key for a tournament. */
export function makeTournamentId(catalogId: string, year: number, gender: 'atp' | 'wta'): string {
	return `${catalogId}-${year}-${gender}`;
}

/** Given an ATP tournament ID, return the paired WTA tournament ID. */
export function getWtaCounterpart(atpTournamentId: string): string {
	return atpTournamentId.replace(/-atp$/, '-wta');
}

/** Given a tournament ID, return the catalog entry. */
export function getCatalogEntry(tournamentId: string): TournamentCatalogEntry | undefined {
	// e.g. 'ausopen-2026-atp' → 'ausopen'
	const parts = tournamentId.split('-');
	const catalogId = parts.slice(0, -2).join('-');
	return TOURNAMENT_CATALOG.find(e => e.id === catalogId);
}
