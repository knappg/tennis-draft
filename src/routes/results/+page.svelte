<script lang="ts">
	import { participants, allPlayers, activeTournament, draftState } from '$lib/stores/draftStore';
	import type { TennisPlayer, PlayerTournamentPoints } from '$lib/types';
	import SyncButton from '$lib/components/SyncButton.svelte';

	let tournamentScores = $state<Record<string, PlayerTournamentPoints>>({});
	let eliminatedPlayerIds = $state<Set<string>>(new Set());

	function getPlayer(id: string): TennisPlayer | undefined {
		return $allPlayers.find((p) => p.id === id);
	}

	function getPlayerPoints(playerId: string): number {
		return tournamentScores[playerId]?.pointsEarned ?? 0;
	}

	function getTeamPoints(picks: string[]): number {
		return picks.reduce((acc, id) => acc + getPlayerPoints(id), 0);
	}

	function getRank(picks: string[]): number {
		const pts = getTeamPoints(picks);
		return $participants.filter((p) => getTeamPoints(p.picks) > pts).length + 1;
	}

	function getWins(playerId: string): number {
		return tournamentScores[playerId]?.wins ?? 0;
	}

	function getRoundReached(playerId: string): string | null {
		return tournamentScores[playerId]?.roundReached ?? null;
	}

	function syncStatus(): 'fresh' | 'stale' | 'none' {
		const lastSynced = $activeTournament?.lastSyncedAt;
		if (!lastSynced) return 'none';
		return Date.now() - new Date(lastSynced).getTime() < 4 * 60 * 60 * 1000 ? 'fresh' : 'stale';
	}

	async function fetchScores() {
		const tournamentId = $draftState.tournamentId;
		const wtaId = $draftState.wtaTournamentId;
		if (!tournamentId) return;

		const ids = [tournamentId, wtaId].filter(Boolean) as string[];
		const [scoresResults, bracketResults] = await Promise.all([
			Promise.all([
				fetch(`/api/tournament/scores?tournamentId=${tournamentId}`),
				wtaId ? fetch(`/api/tournament/scores?tournamentId=${wtaId}`) : Promise.resolve(null)
			]),
			Promise.all(ids.map((id) => fetch(`/api/tournament/bracket?tournamentId=${id}`)))
		]);

		const [atpScoreResp, wtaScoreResp] = scoresResults;
		const atpScores = atpScoreResp.ok ? await atpScoreResp.json() : {};
		const wtaScores = wtaScoreResp?.ok ? await wtaScoreResp.json() : {};
		tournamentScores = { ...atpScores, ...wtaScores };

		const eliminated = new Set<string>();
		for (const resp of bracketResults) {
			if (!resp.ok) continue;
			const matches: { player1Id: string; player2Id: string; winnerId: string | null }[] =
				await resp.json();
			for (const m of matches) {
				if (!m.winnerId) continue;
				if (m.player1Id !== m.winnerId) eliminated.add(m.player1Id);
				if (m.player2Id !== m.winnerId) eliminated.add(m.player2Id);
			}
		}
		eliminatedPlayerIds = eliminated;
	}

	$effect(() => {
		fetchScores();
		const isActive = $activeTournament?.status === 'active';
		if (!isActive) return;
		const interval = setInterval(fetchScores, 5 * 60 * 1000);
		return () => clearInterval(interval);
	});

	const rankedParticipants = $derived(
		[...$participants].sort((a, b) => getTeamPoints(b.picks) - getTeamPoints(a.picks))
	);

	const hasLiveScores = $derived(Object.keys(tournamentScores).length > 0);
</script>

<div class="rp">
	<!-- Header -->
	<div class="rp-header">
		<div class="rp-title-block">
			<h2 class="rp-heading">Draft Results</h2>
			<p class="rp-subtitle">
				{#if $activeTournament}
					{$activeTournament.name}
					{$activeTournament.year} — Scored by wins
				{:else}
					Final team rosters and standings
				{/if}
			</p>
		</div>
		<div class="rp-actions">
			{#if $activeTournament?.lastSyncedAt}
				<div class="rp-sync-status">
					<span class="rp-dot {syncStatus()}"></span>
					<span class="rp-timestamp">
						Synced {new Date($activeTournament.lastSyncedAt).toLocaleTimeString()}
					</span>
				</div>
			{/if}
			{#if !hasLiveScores}
				<span class="rp-no-scores-badge">No results yet</span>
			{/if}
			{#if $draftState.tournamentId}
				<SyncButton
					tournamentId={$draftState.tournamentId}
					wtaTournamentId={$draftState.wtaTournamentId}
					onsynced={fetchScores}
				/>
			{/if}
		</div>
	</div>

	<!-- Teams grid -->
	<div class="rp-grid">
		{#each rankedParticipants as participant (participant.id)}
			{@const teamPoints = getTeamPoints(participant.picks)}
			{@const rank = getRank(participant.picks)}
			<div class="rp-card">
				<!-- Card header -->
				<div class="rp-card-header">
					<div class="rp-rank-badge {rank === 1 ? 'gold' : ''}">
						{rank}
					</div>
					<div class="rp-team-icon">{participant.icon}</div>
					<div class="rp-team-info">
						<span class="rp-team-name">{participant.teamName}</span>
						<span class="rp-participant-name">{participant.name}</span>
					</div>
					<div class="rp-team-score">{teamPoints}</div>
				</div>

				<!-- Player rows -->
				<div class="rp-player-list">
					{#each participant.picks as pickId, i}
						{@const player = getPlayer(pickId)}
						{@const pts = getPlayerPoints(pickId)}
						{@const wins = getWins(pickId)}
						{@const round = getRoundReached(pickId)}
						{#if player}
							<div class="rp-player-row" style="--row-i: {i}">
								{#if i > 0}
									<div class="rp-row-divider"></div>
								{/if}
								<div class="rp-player-inner">
									<div class="rp-player-avatar">
										<span class="rp-avatar-fallback">{player.name.substring(0, 2)}</span>
										<img
											src={player.image}
											alt={player.name}
											class="rp-player-img"
											onerror={(e) => {
												(e.target as HTMLImageElement).style.display = 'none';
											}}
										/>
									</div>
									<div class="rp-player-details">
										<div class="rp-player-top">
											<span class="rp-player-name {eliminatedPlayerIds.has(pickId) ? 'eliminated' : ''}">{player.name}</span>
											<span class="rp-player-pts {pts > 0 ? 'has-pts' : 'no-pts'}">
												{pts > 0 ? `+${pts}` : '—'}
											</span>
										</div>
										<div class="rp-player-meta">
											<span class="rp-country">{player.country}</span>
											{#if player.seed}
												<span class="rp-pill seeded">Seed {player.seed}</span>
											{:else}
												<span class="rp-pill unseeded">Unseeded</span>
											{/if}
											{#if player.tour === 'wta'}
												<span class="rp-pill wta">WTA</span>
											{/if}
											<span class="rp-pill wins-pill {wins > 0 ? 'active' : 'zero'}"
												>{wins}W</span
											>
											{#if round}
												<span class="rp-round">{round}</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{:else}
							<div class="rp-player-row rp-player-empty" style="--row-i: {i}">
								<span>Pick {i + 1} Empty</span>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.rp {
		/* Scoped tokens that would conflict with shadcn globals */
		--border: rgba(0, 0, 0, 0.07);
		--border-strong: rgba(0, 0, 0, 0.12);
		--accent: #1a6b3c;
		--accent-soft: #e8f4ed;

		color: var(--text-primary);
	}

	/* ── Header ── */
	.rp-header {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 20px;
		border-bottom: 1.5px solid var(--border);
		margin-bottom: 28px;
	}

	@media (min-width: 640px) {
		.rp-header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.rp-heading {
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.15;
	}

	.rp-subtitle {
		font-size: 14px;
		font-weight: 400;
		letter-spacing: -0.01em;
		color: var(--text-secondary);
		margin: 4px 0 0;
	}

	.rp-actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	/* ── Sync status dot ── */
	.rp-sync-status {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.rp-dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.rp-dot.fresh {
		background: #1a6b3c;
	}

	.rp-dot.stale {
		background: #e07b39;
	}

	.rp-timestamp {
		font-family: 'DM Mono', monospace;
		font-size: 12px;
		color: var(--text-muted);
	}

	.rp-no-scores-badge {
		font-size: 12px;
		color: var(--text-secondary);
		background: var(--pill-bg);
		padding: 3px 10px;
		border-radius: 999px;
		border: 1px solid var(--border-strong);
	}


	/* ── Grid ── */
	.rp-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	@media (min-width: 768px) {
		.rp-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.rp-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1280px) {
		.rp-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* ── Card ── */
	.rp-card {
		background: var(--surface);
		border-radius: 14px;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.rp-card-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 16px 22px;
		border-bottom: 1.5px solid var(--border);
	}

	.rp-rank-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 600;
		background: var(--pill-bg);
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.rp-rank-badge.gold {
		background: var(--gold-soft);
		color: #8a6a1c;
	}

	.rp-team-icon {
		font-size: 20px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gold-soft);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.rp-team-info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.rp-team-name {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.025em;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rp-participant-name {
		font-size: 12px;
		font-weight: 400;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rp-team-score {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.04em;
		color: var(--text-primary);
		flex-shrink: 0;
	}

	/* ── Player list ── */
	.rp-player-list {
		padding-bottom: 4px;
	}

	.rp-player-row {
		animation: fadeUp 0.45s ease both;
		animation-delay: calc(0.22s + var(--row-i, 0) * 0.08s);
	}

	.rp-row-divider {
		height: 1px;
		background: var(--border);
		margin: 0 22px;
	}

	.rp-player-inner {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 13px 22px;
		transition: background 0.12s ease;
	}

	.rp-player-row:hover .rp-player-inner {
		background: var(--surface-2);
	}

	/* ── Player avatar ── */
	.rp-player-avatar {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: 6px;
		overflow: hidden;
		background: var(--gold-soft);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.rp-player-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		z-index: 1;
	}

	.rp-avatar-fallback {
		font-size: 12px;
		font-weight: 600;
		color: #8a6a1c;
		text-transform: uppercase;
	}

	/* ── Player details ── */
	.rp-player-details {
		flex: 1;
		min-width: 0;
	}

	.rp-player-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		margin-bottom: 4px;
	}

	.rp-player-name {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rp-player-name.eliminated {
		color: #a22525;
		text-decoration: line-through;
	}

	.rp-player-pts {
		font-size: 14px;
		font-weight: 700;
		flex-shrink: 0;
	}

	.rp-player-pts.has-pts {
		color: var(--accent);
	}

	.rp-player-pts.no-pts {
		color: var(--text-muted);
	}

	/* ── Meta row ── */
	.rp-player-meta {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}

	.rp-country {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		color: var(--text-muted);
	}

	.rp-pill {
		font-size: 10px;
		font-weight: 500;
		padding: 1px 6px;
		border-radius: 999px;
		line-height: 1.6;
	}

	.rp-pill.unseeded {
		background: var(--pill-bg);
		color: var(--text-secondary);
	}

	.rp-pill.seeded {
		background: var(--gold-soft);
		color: #8a6a1c;
		border: 1px solid rgba(201, 168, 76, 0.25);
	}

	.rp-pill.wta {
		background: #fdf0f8;
		color: #c0448e;
		border: 1px solid rgba(192, 68, 142, 0.2);
	}

	.rp-pill.wins-pill.active {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.rp-pill.wins-pill.zero {
		background: var(--pill-bg);
		color: var(--text-muted);
	}

	.rp-round {
		font-family: 'DM Mono', monospace;
		font-size: 10px;
		color: var(--text-muted);
	}

	/* ── Empty pick ── */
	.rp-player-empty {
		padding: 13px 22px;
		font-size: 13px;
		color: var(--text-muted);
	}

	/* ── Animations ── */
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

</style>
