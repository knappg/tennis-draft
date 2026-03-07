<script lang="ts">
	import { participants, allPlayers, activeTournament, draftState } from '$lib/stores/draftStore';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCw } from '@lucide/svelte';
	import type { TennisPlayer, PlayerTournamentPoints } from '$lib/types';
	import SyncButton from '$lib/components/SyncButton.svelte';

	// Live tournament scores, polled from the server
	let tournamentScores = $state<Record<string, PlayerTournamentPoints>>({});
	let lastPolled = $state<Date | null>(null);
	let polling = $state(false);

	function getPlayer(id: string): TennisPlayer | undefined {
		return $allPlayers.find(p => p.id === id);
	}

	/** Points for a player: live tournament pts if available, else 0. */
	function getPlayerPoints(playerId: string): number {
		const scored = tournamentScores[playerId];
		if (scored) return scored.pointsEarned;
		return 0;
	}

	function getTeamPoints(picks: string[]): number {
		return picks.reduce((acc, id) => acc + getPlayerPoints(id), 0);
	}

	function getScoreDetail(playerId: string): string | null {
		const scored = tournamentScores[playerId];
		if (!scored) return null;
		const parts = [
			`${scored.roundReached}`,
			`${scored.wins}W`
		];
		if (scored.bonusPoints > 0) parts.push(`+${scored.bonusPoints} bonus`);
		return parts.join(' · ');
	}

	async function fetchScores() {
		const tournamentId = $draftState.tournamentId;
		const wtaId = $draftState.wtaTournamentId;
		if (!tournamentId) return;

		polling = true;
		try {
			const [atpResp, wtaResp] = await Promise.all([
				fetch(`/api/tournament/scores?tournamentId=${tournamentId}`),
				wtaId ? fetch(`/api/tournament/scores?tournamentId=${wtaId}`) : Promise.resolve(null)
			]);
			const atpScores = atpResp.ok ? await atpResp.json() : {};
			const wtaScores = wtaResp?.ok ? await wtaResp.json() : {};
			tournamentScores = { ...atpScores, ...wtaScores };
			lastPolled = new Date();
		} finally {
			polling = false;
		}
	}

	// Initial fetch + poll every 5 min if tournament is active
	$effect(() => {
		fetchScores();
		const isActive = $activeTournament?.status === 'active';
		if (!isActive) return;
		const interval = setInterval(fetchScores, 5 * 60 * 1000);
		return () => clearInterval(interval);
	});

	// Sort participants by total points descending
	const rankedParticipants = $derived(
		[...$participants].sort((a, b) => getTeamPoints(b.picks) - getTeamPoints(a.picks))
	);

	const hasLiveScores = $derived(Object.keys(tournamentScores).length > 0);
</script>

<div class="space-y-8 pb-20">
	<div class="border-b py-4 space-y-3">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Draft Results</h2>
				<p class="text-muted-foreground">
					{#if $activeTournament}
						{$activeTournament.name}
						{$activeTournament.year} — Scored by wins
					{:else}
						Final team rosters and standings
					{/if}
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				{#if lastPolled}
					<span class="text-xs text-muted-foreground">
						Updated {lastPolled.toLocaleTimeString()}
					</span>
				{/if}
				{#if !hasLiveScores}
					<Badge variant="outline" class="text-xs">Showing ranking points (no results yet)</Badge>
				{/if}
				<Button variant="outline" size="sm" onclick={fetchScores} disabled={polling}>
					<RefreshCw class="mr-2 h-3 w-3 {polling ? 'animate-spin' : ''}" />
					Refresh
				</Button>
				{#if $draftState.tournamentId}
					<SyncButton
						tournamentId={$draftState.tournamentId}
						wtaTournamentId={$draftState.wtaTournamentId}
						onsynced={fetchScores}
					/>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each rankedParticipants as participant, rank (participant.id)}
			{@const teamPoints = getTeamPoints(participant.picks)}
			<Card class="flex flex-col h-full hover:shadow-lg transition-shadow">
				<CardHeader class="pb-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm
								{rank === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}"
							>
								{rank + 1}
							</div>
							<Avatar class="h-10 w-10 border-2 border-primary/20">
								<AvatarFallback class="bg-primary/10 text-primary font-bold">
									{participant.icon}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle class="text-lg">{participant.teamName}</CardTitle>
								<CardDescription class="text-xs font-medium">{participant.name}</CardDescription>
							</div>
						</div>
						<Badge variant="secondary" class="font-mono font-bold">
							{teamPoints} pts
						</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex-1">
					<div class="space-y-2 mt-2">
						{#each participant.picks as pickId, i}
							{@const player = getPlayer(pickId)}
							{@const scoreDetail = getScoreDetail(pickId)}
							{@const pts = getPlayerPoints(pickId)}
							{#if player}
								<div
									class="flex items-center gap-3 p-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
								>
									<Avatar class="h-10 w-10 rounded-sm shrink-0">
										<AvatarImage src={player.image} alt={player.name} class="object-cover object-top" />
										<AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
									</Avatar>
									<div class="flex-1 min-w-0">
										<div class="flex items-center justify-between gap-1">
											<p class="text-sm font-semibold truncate">{player.name}</p>
											<span class="font-mono text-sm font-bold shrink-0">{pts} pts</span>
										</div>
										<div class="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
											<div class="flex items-center gap-1">
												<span>{player.country}</span>
												{#if player.tour === 'wta'}
													<Badge variant="outline" class="text-[8px] px-1 h-3.5 text-pink-500 border-pink-300">WTA</Badge>
												{/if}
												{#if player.seed}
													<span>· Seed {player.seed}</span>
												{:else}
													<Badge variant="outline" class="text-[8px] px-1 h-3.5">Unseeded</Badge>
												{/if}
											</div>
										</div>
										{#if scoreDetail}
											<p class="text-[10px] text-muted-foreground/70 mt-0.5 font-mono">{scoreDetail}</p>
										{/if}
									</div>
								</div>
							{:else}
								<div
									class="flex items-center gap-3 p-2 rounded-lg border border-dashed text-muted-foreground"
								>
									<span class="text-sm">Pick {i + 1} Empty</span>
								</div>
							{/if}
						{/each}
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
</div>
