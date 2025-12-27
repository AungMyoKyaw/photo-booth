<script lang="ts">
	import { onMount } from 'svelte';
	import { Camera } from 'lucide-svelte';

	interface Props {
		count?: number;
		onComplete?: () => void;
	}

	let { count = 3, onComplete = () => {} }: Props = $props();

	let current = $state(0);
	let show = $state(false);

	function start() {
		current = count;
		show = true;

		const interval = setInterval(() => {
			current--;
			if (current < 0) {
				clearInterval(interval);
				show = false;
				onComplete();
			}
		}, 1000);
	}

	onMount(() => {
		start();
	});
</script>

{#if show}
	<div class="countdown-overlay">
		{#if current > 0}
			<div class="countdown-number" style="animation: scaleIn 0.5s ease-out">
				{current}
			</div>
		{:else}
			<div class="countdown-icon" style="animation: scaleIn 0.5s ease-out">
				<Camera size={80} strokeWidth={2} />
			</div>
		{/if}
		<div class="countdown-ring"></div>
	</div>
{/if}

<style>
	.countdown-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
	}

	.countdown-number {
		position: relative;
		z-index: 2;
		font-size: min(30vw, 200px);
		font-weight: bold;
		color: #fff;
		text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
	}

	.countdown-icon {
		position: relative;
		z-index: 2;
		color: #fff;
		filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.5));
	}

	.countdown-ring {
		position: absolute;
		width: min(40vw, 280px);
		height: min(40vw, 280px);
		border-radius: 50%;
		border: 8px solid rgba(255, 255, 255, 0.3);
		animation: ringPulse 1s ease-out infinite;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes ringPulse {
		0% {
			transform: scale(0.8);
			opacity: 1;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}
</style>
