<script lang="ts">
	import {
		participants,
		activeTournament,
		draftState,
		addParticipant,
		removeParticipant,
		shuffleParticipants,
		startDraft,
		resetDraft,
		selectTournament
	} from '$lib/stores/draftStore';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Trash2, Shuffle, Play, Plus, RefreshCcw, Check } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { TOURNAMENT_CATALOG } from '$lib/data/tournaments';
	import SyncButton from '$lib/components/SyncButton.svelte';

	let name = $state('');
	let teamName = $state('');
	let selectedIcon = $state('🎾');
	let selectingYear = $state(new Date().getFullYear());

	const icons = ['🎾', '🏆', '🚀', '⭐', '🔥', '⚡', '🦁', '🦅', '🦈', '🐻'];

	/** True when the draft is complete and the tournament hasn't finished yet. Lock the setup UI. */
	const tournamentOngoing = $derived(
		$draftState.isComplete && !!$activeTournament && $activeTournament.status !== 'complete'
	);

	function handleAdd() {
		if (!name || !teamName) return;
		addParticipant(name, teamName, selectedIcon);
		name = '';
		teamName = '';
	}

	function handleStart() {
		startDraft();
		goto('/draft');
	}

	async function handleSelectTournament(catalogId: string) {
		await selectTournament(catalogId, selectingYear);
	}

	const currentCatalogId = $derived(
		$activeTournament ? $activeTournament.id.split('-').slice(0, -2).join('-') : null
	);
</script>

<div class="space-y-8">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Draft Setup</h2>
			<p class="text-muted-foreground">Select a tournament, add participants, and start the draft.</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" size="icon" onclick={resetDraft} title="Reset All" disabled={tournamentOngoing}>
				<RefreshCcw class="h-4 w-4" />
			</Button>
			<Button variant="outline" onclick={shuffleParticipants} disabled={$participants.length < 2 || tournamentOngoing}>
				<Shuffle class="mr-2 h-4 w-4" />
				Shuffle Order
			</Button>
			<Button onclick={handleStart} disabled={$participants.length < 2 || !$activeTournament || tournamentOngoing}>
				<Play class="mr-2 h-4 w-4" />
				Start Draft
			</Button>
		</div>
	</div>

	{#if tournamentOngoing}
		<div class="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
			<span class="text-base">🔒</span>
			<span>
				<strong>{$activeTournament?.name} {$activeTournament?.year}</strong> is in progress.
				The draft is locked until the tournament concludes.
			</span>
		</div>
	{/if}

	<!-- Tournament Selection -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<div>
				<h3 class="text-xl font-semibold">Tournament</h3>
				<p class="text-sm text-muted-foreground">Choose the tournament for this draft.</p>
			</div>
			<div class="flex items-center gap-3">
				<Label for="year" class="text-sm">Year</Label>
				<Input
					id="year"
					type="number"
					bind:value={selectingYear}
					min={2024}
					max={2030}
					class="w-24"
				/>
				{#if $activeTournament}
					<SyncButton
						tournamentId={$activeTournament.id}
						wtaTournamentId={$activeTournament.id.replace(/-atp$/, '-wta')}
					/>
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
			{#each TOURNAMENT_CATALOG as entry}
				{@const isSelected = currentCatalogId === entry.id && $activeTournament?.year === selectingYear}
				<button
					onclick={() => handleSelectTournament(entry.id)}
					disabled={tournamentOngoing}
					class="relative text-left p-4 rounded-lg border-2 transition-all duration-200
						{tournamentOngoing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
						{isSelected
						? 'border-primary bg-primary/5'
						: 'border-border bg-card hover:border-primary/50'}"
				>
					{#if isSelected}
						<div class="absolute top-2 right-2">
							<Check class="h-4 w-4 text-primary" />
						</div>
					{/if}
					<div class="space-y-1.5">
						<p class="font-semibold text-sm leading-tight">{entry.name}</p>
						<div class="flex flex-wrap gap-1">
							<Badge variant="outline" class="text-[10px] px-1.5 py-0">{entry.surface}</Badge>
							<Badge
								variant={entry.tourType === 'slam' ? 'secondary' : 'outline'}
								class="text-[10px] px-1.5 py-0"
							>
								{entry.tourType === 'slam' ? 'Grand Slam' : 'Masters'}
							</Badge>
						</div>
						<p class="text-xs text-muted-foreground">{entry.month}</p>
					</div>
				</button>
			{/each}
		</div>

		{#if $activeTournament}
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<Check class="h-4 w-4 text-green-500" />
				<span>
					Selected: <strong class="text-foreground"
						>{$activeTournament.name} {$activeTournament.year}</strong
					>
					— Rounds 1–5 ATP · Round 6 WTA
				</span>
				{#if !$activeTournament.apiId}
					<Badge variant="outline" class="text-[10px]">No live data</Badge>
				{:else if $activeTournament.lastSyncedAt}
					<Badge variant="secondary" class="text-[10px]">
						Synced {new Date($activeTournament.lastSyncedAt).toLocaleDateString()}
					</Badge>
				{/if}
			</div>
		{:else}
			<p class="text-sm text-amber-600 dark:text-amber-400">
				Select a tournament above before starting the draft.
			</p>
		{/if}
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<!-- Add Participant Form -->
		<Card>
			<CardHeader>
				<CardTitle>Add Participant</CardTitle>
				<CardDescription>Enter participant details.</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="name">Full Name</Label>
					<Input id="name" bind:value={name} placeholder="e.g. Roger Federer" />
				</div>
				<div class="space-y-2">
					<Label for="team">Team Name</Label>
					<Input id="team" bind:value={teamName} placeholder="e.g. The Basel Ballers" />
				</div>
				<div class="space-y-2">
					<Label>Choose Icon</Label>
					<div class="flex flex-wrap gap-2">
						{#each icons as icon}
							<button
								class="h-10 w-10 flex items-center justify-center rounded-md border text-lg hover:bg-accent transition-colors {selectedIcon ===
								icon
									? 'bg-primary text-primary-foreground border-primary'
									: 'bg-background'}"
								onclick={() => (selectedIcon = icon)}
							>
								{icon}
							</button>
						{/each}
					</div>
				</div>
				<Button class="w-full" onclick={handleAdd} disabled={!name || !teamName || tournamentOngoing}>
					<Plus class="mr-2 h-4 w-4" />
					Add Participant
				</Button>
			</CardContent>
		</Card>

		<!-- Participants List -->
		<Card>
			<CardHeader>
				<CardTitle class="flex justify-between items-center">
					<span>Participants</span>
					<Badge variant="secondary">{$participants.length} Players</Badge>
				</CardTitle>
				<CardDescription>Current draft order (Snake Draft).</CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
				{#if $participants.length === 0}
					<div class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
						No participants added yet.
					</div>
				{/if}
				{#each $participants as participant, i (participant.id)}
					<div
						class="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex items-center justify-center h-8 w-8 rounded-full bg-muted font-bold text-muted-foreground text-sm"
							>
								{i + 1}
							</div>
							<Avatar>
								<AvatarFallback>{participant.icon}</AvatarFallback>
							</Avatar>
							<div>
								<p class="font-medium leading-none">{participant.name}</p>
								<p class="text-xs text-muted-foreground mt-1">{participant.teamName}</p>
							</div>
						</div>
						<Button variant="ghost" size="icon" onclick={() => removeParticipant(participant.id)} disabled={tournamentOngoing}>
							<Trash2 class="h-4 w-4 text-destructive" />
						</Button>
					</div>
				{/each}
			</CardContent>
		</Card>
	</div>
</div>
