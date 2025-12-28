<script lang="ts">
	import { onMount } from 'svelte';
	import { Camera, Sparkles } from 'lucide-svelte';

	interface Props {
		count?: number;
		onComplete?: () => void;
	}

	let { count = 3, onComplete = () => {} }: Props = $props();

	let current = $state(0);
	let show = $state(false);
	let phase = $state<'countdown' | 'flash'>('countdown');

	function start() {
		current = count;
		show = true;
		phase = 'countdown';

		const interval = setInterval(() => {
			current--;
			if (current < 0) {
				clearInterval(interval);
				phase = 'flash';
				// Brief flash effect before completing
				setTimeout(() => {
					show = false;
					onComplete();
				}, 200);
			}
		}, 1000);
	}

	onMount(() => {
		start();
	});
</script>

{#if show}
	<div class="countdown-overlay" class:flash={phase === 'flash'}>
		<div class="countdown-backdrop"></div>

		{#if phase === 'countdown'}
			{#if current > 0}
				{#key current}
					<div class="countdown-content">
						<div class="countdown-ring-outer"></div>
						<div class="countdown-ring-inner"></div>
						<div class="countdown-number">
							{current}
						</div>
					</div>
				{/key}
			{:else}
				<div class="countdown-capture">
					<div class="capture-burst"></div>
					<div class="capture-icon">
						<Camera size={64} strokeWidth={2} />
					</div>
					<div class="capture-sparkles">
						<Sparkles size={24} />
					</div>
				</div>
			{/if}
		{/if}

		<div class="countdown-hint">
			{#if current > 0}
				Get ready!
			{:else}
				Say cheese! 📸
			{/if}
		</div>
	</div>
{/if}

<style>
	.countdown-overlay {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		z-index: 200;
		transition: background 0.2s;
	}

	.countdown-overlay.flash {
		background: white !important;
	}

	.countdown-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(20px);
	}

	.countdown-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: scaleIn 0.4s var(--ease-out-back);
	}

	.countdown-ring-outer {
		position: absolute;
		width: 220px;
		height: 220px;
		border-radius: 50%;
		border: 4px solid rgba(255, 255, 255, 0.1);
		animation: ringExpand 1s ease-out infinite;
	}

	.countdown-ring-inner {
		position: absolute;
		width: 180px;
		height: 180px;
		border-radius: 50%;
		border: 6px solid var(--accent);
		border-top-color: transparent;
		animation: ringRotate 1s linear infinite;
	}

	@keyframes ringExpand {
		0% {
			transform: scale(0.9);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.3);
			opacity: 0;
		}
	}

	@keyframes ringRotate {
		to {
			transform: rotate(360deg);
		}
	}

	.countdown-number {
		position: relative;
		z-index: 2;
		font-family: var(--font-display);
		font-size: clamp(100px, 25vw, 180px);
		font-weight: 700;
		color: #fff;
		text-shadow: 0 0 60px rgba(255, 255, 255, 0.5);
		animation: numberPop 0.5s var(--ease-out-back);
	}

	@keyframes numberPop {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.8);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.countdown-capture {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: captureFlash 0.3s var(--ease-out-expo);
	}

	@keyframes captureFlash {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.capture-burst {
		position: absolute;
		width: 200px;
		height: 200px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		border-radius: 50%;
		animation: burstExpand 0.5s ease-out forwards;
	}

	@keyframes burstExpand {
		0% {
			transform: scale(0.5);
			opacity: 1;
		}
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.capture-icon {
		position: relative;
		z-index: 2;
		color: white;
		filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.8));
	}

	.capture-sparkles {
		position: absolute;
		top: -20px;
		right: -20px;
		color: var(--secondary);
		animation: sparkle 0.3s ease-out;
	}

	@keyframes sparkle {
		0% {
			transform: scale(0) rotate(-30deg);
			opacity: 0;
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.countdown-hint {
		position: relative;
		z-index: 2;
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.8);
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 999px;
		backdrop-filter: blur(10px);
		animation: slideUp 0.5s var(--ease-out-expo) 0.2s both;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
