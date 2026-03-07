<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { RefreshCw } from '@lucide/svelte';

	interface Props {
		tournamentId: string;
		wtaTournamentId?: string | null;
		onsynced?: () => void;
	}

	let { tournamentId, wtaTournamentId = null, onsynced }: Props = $props();

	let expanded = $state(false);
	let password = $state('');
	let syncing = $state(false);
	let message = $state('');
	let isError = $state(false);

	async function handleSync() {
		if (!password) return;
		syncing = true;
		message = '';
		isError = false;

		const ids = [tournamentId, wtaTournamentId].filter(Boolean) as string[];

		try {
			for (const id of ids) {
				const resp = await fetch('/api/tournament/sync', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ tournamentId: id, password })
				});

				if (resp.status === 403) {
					message = 'Incorrect password.';
					isError = true;
					return;
				}
				if (!resp.ok) {
					message = `Sync failed (${resp.status}).`;
					isError = true;
					return;
				}

				const data = await resp.json();
				if (data.skipped) {
					message = 'No SportDevs ID configured — nothing to sync.';
					return;
				}
			}

			message = 'Synced!';
			password = '';
			expanded = false;
			onsynced?.();
		} catch {
			message = 'Network error.';
			isError = true;
		} finally {
			syncing = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSync();
		if (e.key === 'Escape') {
			expanded = false;
			password = '';
			message = '';
		}
	}
</script>

<div class="flex items-center gap-2">
	{#if !expanded}
		<Button variant="outline" size="sm" class="sync-trigger-btn" onclick={() => (expanded = true)}>
			<RefreshCw class="mr-2 h-3 w-3" />
			Sync Now
		</Button>
	{:else}
		<Input
			type="password"
			placeholder="Sync password"
			bind:value={password}
			onkeydown={handleKeydown}
			class="h-8 w-36 text-sm"
			autofocus
		/>
		<Button size="sm" onclick={handleSync} disabled={syncing || !password}>
			<RefreshCw class="mr-1 h-3 w-3 {syncing ? 'animate-spin' : ''}" />
			{syncing ? 'Syncing…' : 'Go'}
		</Button>
		<Button variant="ghost" size="sm" onclick={() => { expanded = false; password = ''; message = ''; }}>
			Cancel
		</Button>
	{/if}

	{#if message}
		<span class="text-xs {isError ? 'text-destructive' : 'text-muted-foreground'}">{message}</span>
	{/if}
</div>

<style>
	:global(.sync-trigger-btn:hover) {
		background-color: #e8f4ed;
		color: #1a6b3c;
		border-color: rgba(26, 107, 60, 0.3);
	}
</style>
