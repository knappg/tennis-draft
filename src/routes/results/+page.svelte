<script lang="ts">
	import { participants } from '$lib/stores/draftStore';
	import { TENNIS_PLAYERS } from '$lib/data/players';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Trophy } from '@lucide/svelte';
	import type { TennisPlayer } from '$lib/types';

	// Helper to get full player object
	function getPlayer(id: string): TennisPlayer | undefined {
		return TENNIS_PLAYERS.find((p) => p.id === id);
	}

	// Helper to calculate total team points
	function getTeamPoints(picks: string[]): number {
		return picks.reduce((acc, id) => {
			const p = getPlayer(id);
			return acc + (p?.points || 0);
		}, 0);
	}
</script>

<div class="space-y-8 pb-20">
	<div class="flex items-center justify-between border-b py-4">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Draft Results</h2>
			<p class="text-muted-foreground">Final team rosters and analysis</p>
		</div>
		<div class="flex items-center gap-2">
			<!-- Placeholder for potential export/share buttons -->
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each $participants as participant (participant.id)}
			{@const teamPoints = getTeamPoints(participant.picks)}
			<Card class="flex flex-col h-full hover:shadow-lg transition-shadow">
				<CardHeader class="pb-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Avatar class="h-10 w-10 border-2 border-primary/20">
								<AvatarFallback class="bg-primary/10 text-primary font-bold"
									>{participant.icon}</AvatarFallback
								>
							</Avatar>
							<div>
								<CardTitle class="text-lg">{participant.teamName}</CardTitle>
								<CardDescription class="text-xs font-medium">{participant.name}</CardDescription>
							</div>
						</div>
						<Badge variant="secondary" class="font-mono">{teamPoints.toLocaleString()} pts</Badge>
					</div>
				</CardHeader>
				<CardContent class="flex-1">
					<div class="space-y-3 mt-2">
						{#each participant.picks as pickId, i}
							{@const player = getPlayer(pickId)}
							{#if player}
								<div
									class="flex items-center gap-3 p-2 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
								>
									<Avatar class="h-10 w-10 rounded-sm">
										<AvatarImage src={player.image} alt={player.name} class="object-cover" />
										<AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
									</Avatar>
									<div class="flex-1 min-w-0">
										<div class="flex items-center justify-between">
											<p class="text-sm font-semibold truncate pr-2">{player.name}</p>
											{#if player.seed}
												<span class="text-[10px] text-muted-foreground shrink-0"
													>Seed {player.seed}</span
												>
											{:else}
												<Badge variant="outline" class="text-[9px] px-1 h-4">Unseeded</Badge>
											{/if}
										</div>
										<div
											class="flex items-center justify-between text-xs text-muted-foreground mt-0.5"
										>
											<span class="flex items-center gap-1">
												{player.country}
											</span>
											<span class="font-mono">{player.points.toLocaleString()} pts</span>
										</div>
									</div>
								</div>
							{:else}
								<!-- Should ideally not happen if draft is complete -->
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
