<script lang="ts">
	import {
		participants,
		addParticipant,
		removeParticipant,
		shuffleParticipants,
		startDraft,
		resetDraft
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
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Trash2, Shuffle, Play, Plus, RefreshCcw } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let name = $state('');
	let teamName = $state('');
	let selectedIcon = $state('🎾');

	const icons = ['🎾', '🏆', '🚀', '⭐', '🔥', '⚡', '🦁', '🦅', '🦈', '🐻'];

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
</script>

<div class="space-y-8">
	<div class="flex justify-between items-center">
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Draft Setup</h2>
			<p class="text-muted-foreground">Add participants and configure the draft order.</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" size="icon" onclick={resetDraft} title="Reset All">
				<RefreshCcw class="h-4 w-4" />
			</Button>
			<Button variant="outline" onclick={shuffleParticipants} disabled={$participants.length < 2}>
				<Shuffle class="mr-2 h-4 w-4" />
				Shuffle Order
			</Button>
			<Button onclick={handleStart} disabled={$participants.length < 2}>
				<Play class="mr-2 h-4 w-4" />
				Start Draft
			</Button>
		</div>
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
				<Button class="w-full" onclick={handleAdd} disabled={!name || !teamName}>
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
						<Button variant="ghost" size="icon" onclick={() => removeParticipant(participant.id)}>
							<Trash2 class="h-4 w-4 text-destructive" />
						</Button>
					</div>
				{/each}
			</CardContent>
		</Card>
	</div>
</div>
