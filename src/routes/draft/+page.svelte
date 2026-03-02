<script lang="ts">
	import {
		draftState,
		currentParticipant,
		participants,
		availablePlayers,
		makePick,
		draftedPlayers
	} from '$lib/stores/draftStore';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { Lock, Check, User } from '@lucide/svelte';
	import DraftTimer from '$lib/components/DraftTimer.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { TennisPlayer } from '$lib/types';
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';

	let stagedPlayerId = $state<string | null>(null);

	// Reactive derived state (locally)
	let currentPicker = $derived($currentParticipant);
	let isMyTurn = $derived(true); // Single player mode, so always "my" turn to act for the current picker

	$effect(() => {
		if ($draftState.isComplete) {
			goto('/results');
		}
	});

	function handleStage(id: string) {
		if (stagedPlayerId === id) {
			stagedPlayerId = null; // Unstage
		} else {
			stagedPlayerId = id;
		}
	}

	function handleLockIn() {
		if (stagedPlayerId) {
			makePick(stagedPlayerId);
			stagedPlayerId = null;
		}
	}

	function getPlayerById(id: string) {
		// Need access to full list including drafted.
		// availablePlayers only has available.
		// But TENNIS_PLAYERS from data has all.
		// Let's import TENNIS_PLAYERS or just use a helper if availablePlayers removed them.
		// For now, let's assume we can import it.
		// But better: store all players in a 'allPlayers' store or map.
		// I'll import the constant for display purposes of drafted slots.
		// Wait, I can't import TENNIS_PLAYERS in script block if not exported from store or file.
		// It is exported from '$lib/data/players'.
		return mockAllPlayers.find((p) => p.id === id);
	}

	import { TENNIS_PLAYERS } from '$lib/data/players';
	const mockAllPlayers = TENNIS_PLAYERS;
</script>

<div class="space-y-8 pb-20">
	<!-- Header / status -->
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b"
	>
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Draft Board</h2>
			<div class="flex items-center gap-2 text-muted-foreground">
				<Badge variant="outline">Round {$draftState.currentRound} / 6</Badge>
				<span>•</span>
				<span>Pick {$draftState.currentPickIndex + 1}</span>
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
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto pb-4"
	>
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
								class="aspect-[3/4] rounded bg-muted/50 border flex flex-col items-center justify-center p-1 relative overflow-hidden group"
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
		<h3 class="text-xl font-bold mb-4 flex items-center gap-2">
			Available Players
			<Badge variant="secondary">{$availablePlayers.length}</Badge>
		</h3>

		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
			{#each $availablePlayers as player (player.id)}
				<button
					onclick={() => handleStage(player.id)}
					class="text-left group relative transition-all duration-200 outline-none focus:ring-2 ring-primary rounded-lg overflow-hidden border bg-card hover:shadow-md
            {stagedPlayerId === player.id
						? 'ring-4 ring-primary shadow-xl scale-105 z-10 border-primary'
						: 'hover:border-primary/50'}"
				>
					<div class="aspect-[3/4] relative">
						<img
							src={player.image}
							alt={player.name}
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div class="absolute top-2 right-2">
							<Badge variant={player.seed ? 'secondary' : 'default'} class="font-bold shadow-sm">
								{#if player.seed}
									Rank {player.currentRanking}, Seed {player.seed}
								{:else}
									Rank {player.currentRanking ?? '-'}, Unseeded
								{/if}
							</Badge>
						</div>
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
						<h4 class="font-bold truncate">{player.name}</h4>

						<div class="flex justify-between items-center mt-1">
							<span class="text-xs text-muted-foreground">{player.country}</span>
							<span class="text-xs font-mono">{player.points} pts</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Floating Action Button for Lock In -->
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
