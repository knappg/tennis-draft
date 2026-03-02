<script lang="ts">
	import { draftState } from '$lib/stores/draftStore';
	import { Button } from '$lib/components/ui/button';
	import { Play, Pause, AlertCircle } from '@lucide/svelte';
	import { onMount, onDestroy } from 'svelte';

	let timeLeft = $state(180); // 3 minutes in seconds
	let isRunning = $state(true);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Track current pick index to trigger resets
	let lastPickIndex = $state($draftState.currentPickIndex);

	function formatTime(seconds: number) {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	function toggleTimer() {
		isRunning = !isRunning;
	}

	// Watch for turn changes
	$effect(() => {
		if ($draftState.currentPickIndex !== lastPickIndex) {
			lastPickIndex = $draftState.currentPickIndex;
			// Reset and start
			timeLeft = 180;
			isRunning = true;
		}
	});

	// Timer logic
	$effect(() => {
		if (isRunning && timeLeft > 0) {
			timerInterval = setInterval(() => {
				if (timeLeft > 0) {
					timeLeft--;
				} else {
					// Reached 0, clear interval locally (logic handled by reactive UI)
					if (timerInterval) clearInterval(timerInterval);
				}
			}, 1000);
		} else {
			if (timerInterval) clearInterval(timerInterval);
		}

		return () => {
			if (timerInterval) clearInterval(timerInterval);
		};
	});

	// Shake effect class
	let containerClass = $derived(
		`flex items-center gap-2 px-3 py-1 rounded-md border text-sm font-mono transition-colors duration-300 ${
			timeLeft === 0
				? 'bg-destructive/20 text-destructive border-destructive animate-shake'
				: 'bg-muted text-muted-foreground border-transparent'
		}`
	);
</script>

<div class={containerClass}>
	{#if timeLeft === 0}
		<AlertCircle class="w-4 h-4 mr-1 animate-pulse" />
	{/if}
	<span class="font-bold text-lg w-[3ch] text-center">{formatTime(timeLeft)}</span>

	<Button variant="ghost" size="icon" class="h-6 w-6 ml-1" onclick={toggleTimer}>
		{#if isRunning && timeLeft > 0}
			<Pause class="h-3 w-3" />
		{:else}
			<Play class="h-3 w-3" />
		{/if}
	</Button>
</div>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: translateX(-4px);
		}
		20%,
		40%,
		60%,
		80% {
			transform: translateX(4px);
		}
	}
	:global(.animate-shake) {
		animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
	}
</style>
