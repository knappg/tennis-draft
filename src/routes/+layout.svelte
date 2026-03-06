<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Settings, Users, Trophy } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { draftState, initFromServer } from '$lib/stores/draftStore';

	let { children, data } = $props();

	$effect(() => {
		initFromServer(
			data.serverParticipants,
			data.serverState,
			data.serverDraftedMap,
			data.serverPlayers,
			data.serverWtaPlayers,
			data.serverTournament
		);
	});

	const navItems = [
		{ href: '/setup', label: 'Setup', icon: Settings },
		{ href: '/draft', label: 'Draft', icon: Users },
		{ href: '/results', label: 'Results', icon: Trophy }
	];
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar -->
	<aside class="w-64 border-r bg-muted/30 hidden md:flex flex-col">
		<div class="p-6 border-b">
			<h1 class="text-xl font-bold tracking-tight text-primary">Tennis Draft</h1>
		</div>
		<nav class="flex-1 p-4 space-y-2">
			{#each navItems as item}
				{@const isDisabled = item.label === 'Draft' && $draftState.status !== 'draft'}
				<Button
					variant={$page.url.pathname === item.href ? 'secondary' : 'ghost'}
					class="w-full justify-start gap-2"
					href={item.href}
					disabled={isDisabled}
				>
					<item.icon class="h-4 w-4" />
					{item.label}
				</Button>
			{/each}
		</nav>
	</aside>

	<!-- Mobile Nav -->
	<div class="md:hidden absolute top-0 left-0 p-4">
		<!-- TODO: Mobile Menu -->
	</div>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		<div class="p-8 max-w-7xl mx-auto">
			{@render children()}
		</div>
	</main>
</div>
