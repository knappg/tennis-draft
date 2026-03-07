<script lang="ts">
	import {
		draftState,
		currentParticipant,
		participants,
		availablePlayers,
		allPlayers,
		makePick
	} from '$lib/stores/draftStore';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { Lock, Check, AlertCircle } from '@lucide/svelte';
	import DraftTimer from '$lib/components/DraftTimer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { fade, scale } from 'svelte/transition';
	import { getRoundLabel } from '$lib/data/tournamentPoints';

	import type { PlayerTournamentPoints, TournamentMatch } from '$lib/types';

	let stagedPlayerId = $state<string | null>(null);
	let tournamentScores = $state<Record<string, PlayerTournamentPoints>>({});
	let eliminatedIds = $state<Set<string>>(new Set());

	let currentPicker = $derived($currentParticipant);

	$effect(() => {
		if ($draftState.isComplete) {
			goto(`${base}/results`);
		}
	});

	async function fetchTournamentStatus() {
		const atpId = $draftState.tournamentId;
		const wtaId = $draftState.wtaTournamentId;
		if (!atpId) return;

		const ids = [atpId, wtaId].filter(Boolean) as string[];
		const [scoresResults, bracketResults] = await Promise.all([
			Promise.all(ids.map(id => fetch(`${base}/api/tournament/scores?tournamentId=${id}`).then(r => r.json()))),
			Promise.all(ids.map(id => fetch(`${base}/api/tournament/bracket?tournamentId=${id}`).then(r => r.json())))
		]);

		const merged: Record<string, PlayerTournamentPoints> = {};
		for (const s of scoresResults) Object.assign(merged, s);
		tournamentScores = merged;

		const eliminated = new Set<string>();
		for (const matches of bracketResults) {
			for (const m of (matches as TournamentMatch[])) {
				if (m.winnerId) {
					if (m.player1Id !== m.winnerId) eliminated.add(m.player1Id);
					if (m.player2Id !== m.winnerId) eliminated.add(m.player2Id);
				}
			}
		}
		eliminatedIds = eliminated;
	}

	$effect(() => {
		fetchTournamentStatus();
	});

	function getPlayerStatus(playerId: string): 'eliminated' | 'winning' | null {
		if (eliminatedIds.has(playerId)) return 'eliminated';
		if ((tournamentScores[playerId]?.wins ?? 0) > 0) return 'winning';
		return null;
	}

	function statusBorder(playerId: string): string {
		const s = getPlayerStatus(playerId);
		if (s === 'eliminated') return 'border-red-500 border-2';
		if (s === 'winning') return 'border-blue-500 border-2';
		return '';
	}

	function handleStage(id: string) {
		stagedPlayerId = stagedPlayerId === id ? null : id;
	}

	function handleLockIn() {
		if (stagedPlayerId) {
			makePick(stagedPlayerId);
			stagedPlayerId = null;
		}
	}

	function getPlayerById(id: string) {
		return $allPlayers.find(p => p.id === id);
	}

	function getSeedLabel(player: { seed: number | null; currentRanking: number | null }): string {
		if (player.seed) return `Seed ${player.seed}`;
		if (player.currentRanking) return `Rank ${player.currentRanking}`;
		return 'Unseeded';
	}

	const roundLabel = $derived(getRoundLabel($draftState.currentRound));
	const isWtaRound = $derived($draftState.currentRound === 6);
</script>

<div class="space-y-8 pb-20">
	<!-- Header / status -->
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b"
	>
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Draft Board</h2>
			<div class="flex items-center gap-2 text-muted-foreground flex-wrap">
				<Badge variant="outline">Round {$draftState.currentRound} / 6</Badge>
				<span>•</span>
				<span>Pick {$draftState.currentPickIndex + 1}</span>
				<span>•</span>
				<span class="text-sm font-medium {isWtaRound ? 'text-pink-500' : 'text-blue-500'}">
					{roundLabel}
				</span>
			</div>
		</div>

		{#if currentPicker}
			<div
				class="flex items-center gap-4 bg-primary/10 p-3 rounded-lg border border-primary/20 animate-pulse"
			>
				<DraftTimer />
				<div class="text-right">
					<p class="text-xs font-semibold text-primary uppercase tracking-wider">On The Clock</p>
					<p class="text-lg font-bold">{currentPicker.name}</p>
				</div>
				<Avatar class="h-12 w-12 border-2 border-primary">
					<AvatarFallback>{currentPicker.icon}</AvatarFallback>
				</Avatar>
			</div>
		{/if}
	</div>

	<!-- Participants Draft Slots -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
		{#each $participants as participant (participant.id)}
			<Card
				class="{currentPicker?.id === participant.id
					? 'border-primary shadow-lg ring-1 ring-primary/20'
					: 'opacity-80'} transition-all duration-300"
			>
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<div class="flex items-center gap-2">
						<Avatar class="h-8 w-8">
							<AvatarFallback>{participant.icon}</AvatarFallback>
						</Avatar>
						<div class="overflow-hidden">
							<CardTitle class="text-sm font-medium truncate">{participant.name}</CardTitle>
							<CardDescription class="text-xs truncate">{participant.teamName}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-3 gap-2 mt-2">
						{#each Array(6) as _, i}
							{@const pickId = participant.picks[i]}
							{@const player = pickId ? getPlayerById(pickId) : null}
							<div
								class="aspect-[3/4] rounded bg-muted/50 flex flex-col items-center justify-center p-1 relative overflow-hidden
								{player ? statusBorder(player.id) || 'border' : 'border'}"
							>
								{#if player}
									<img
										src={player.image}
										alt={player.name}
										class="absolute inset-0 w-full h-full object-cover opacity-80"
									/>
									<div class="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center">
										<Tooltip.Provider>
											<Tooltip.Root>
												<Tooltip.Trigger class="w-full">
													<span class="text-[10px] text-white font-bold block truncate"
														>{player.name}</span
													>
												</Tooltip.Trigger>
												<Tooltip.Content>
													<p>{player.name}</p>
												</Tooltip.Content>
											</Tooltip.Root>
										</Tooltip.Provider>
									</div>
								{:else}
									<span class="text-[10px] text-muted-foreground/50">{i + 1}</span>
								{/if}
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<Separator />

	<!-- Player Pool -->
	<div>
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-xl font-bold flex items-center gap-2">
				Available Players
				<Badge variant="secondary">{$availablePlayers.length}</Badge>
				{#if isWtaRound}
					<Badge variant="outline" class="text-pink-500 border-pink-300">WTA</Badge>
				{/if}
			</h3>
		</div>

		{#if $availablePlayers.length === 0 && !$draftState.isComplete}
			<div
				class="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg gap-3"
			>
				<AlertCircle class="h-8 w-8" />
				<p class="text-sm font-medium">No eligible players for {roundLabel}</p>
				<p class="text-xs">
					{#if isWtaRound}
						Sync the WTA draw on the Setup page to see available players.
					{:else}
						Sync the ATP draw on the Setup page to see available players.
					{/if}
				</p>
			</div>
		{/if}

		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
			{#each $availablePlayers as player (player.id)}
				<button
					onclick={() => handleStage(player.id)}
					class="text-left group relative transition-all duration-200 outline-none focus:ring-2 ring-primary rounded-lg overflow-hidden border bg-card hover:shadow-md
					{stagedPlayerId === player.id
						? 'ring-4 ring-primary shadow-xl scale-105 z-10 border-primary'
						: statusBorder(player.id) || 'hover:border-primary/50'}"
				>
					<div class="aspect-[3/4] relative">
						<img
							src={player.image}
							alt={player.name}
							class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
						/>
						<div class="absolute top-2 right-2">
							<Badge
								variant={player.seed ? 'secondary' : 'default'}
								class="font-bold shadow-sm text-[9px] px-1.5"
							>
								{getSeedLabel(player)}
							</Badge>
						</div>
						{#if player.tour === 'wta'}
							<div class="absolute top-2 left-2">
								<Badge variant="outline" class="text-pink-400 border-pink-300 text-[9px] px-1.5">
									WTA
								</Badge>
							</div>
						{/if}
						{#if stagedPlayerId === player.id}
							<div
								class="absolute inset-0 bg-primary/20 flex items-center justify-center"
								transition:fade
							>
								<Check class="w-12 h-12 text-white drop-shadow-md" />
							</div>
						{/if}
					</div>
					<div class="p-3">
						<h4 class="font-bold truncate text-sm">{player.name}</h4>
						<div class="flex justify-between items-center mt-1">
							<span class="text-xs text-muted-foreground">{player.country}</span>
							<span class="text-xs font-mono text-muted-foreground"
								>{player.currentRanking != null ? `#${player.currentRanking}` : '—'}</span
							>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Floating Lock In Button -->
	{#if stagedPlayerId}
		<div class="fixed bottom-8 right-8 z-50" transition:scale>
			<Button
				size="lg"
				class="h-16 px-8 text-lg font-bold shadow-2xl rounded-full animate-bounce"
				onclick={handleLockIn}
			>
				<Lock class="mr-2 h-5 w-5" />
				Lock In Selection
			</Button>
		</div>
	{/if}
</div>
