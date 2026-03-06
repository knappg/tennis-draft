import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { syncTournament } from '$lib/server/syncService';
import { getTournamentById } from '$lib/server/draftQueries';
import { config } from '$lib/server/config';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { tournamentId, password } = body as { tournamentId: string; password: string };

	console.log('[sync] request received, tournamentId:', tournamentId);
	console.log('[sync] SYNC_PASSWORD configured:', !!config.syncPassword);

	if (!tournamentId) {
		console.error('[sync] Missing tournamentId');
		error(400, 'Missing tournamentId');
	}

	if (!config.syncPassword) {
		console.error('[sync] SYNC_PASSWORD env var is empty or missing');
		error(500, 'SYNC_PASSWORD is not configured on the server');
	}

	if (password !== config.syncPassword) {
		console.error('[sync] Incorrect password provided');
		error(403, 'Incorrect password');
	}

	const tournament = getTournamentById(tournamentId);
	if (!tournament) {
		error(404, `Tournament not found: ${tournamentId}`);
	}

	if (!tournament.apiId) {
		return json({ ok: true, skipped: true, reason: 'No API ID configured for this tournament' });
	}

	try {
		await syncTournament(tournamentId);
	} catch (e) {
		console.error('[sync] syncTournament failed:', e);
		error(500, e instanceof Error ? e.message : 'Sync failed');
	}

	const updated = getTournamentById(tournamentId);
	return json({ ok: true, lastSyncedAt: updated?.lastSyncedAt ?? null });
};
