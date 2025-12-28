<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { Check } from 'lucide-svelte';

	const frames = [
		{ id: 'none', name: 'None', color: 'transparent', borderColor: 'var(--border-color)' },
		{ id: 'white', name: 'White', color: '#ffffff', borderColor: '#e5e5e5' },
		{ id: 'black', name: 'Black', color: '#1a1a1a', borderColor: '#000000' },
		{ id: 'gold', name: 'Gold', color: '#fbbf24', borderColor: '#f59e0b' },
		{ id: 'silver', name: 'Silver', color: '#9ca3af', borderColor: '#6b7280' },
		{ id: 'rose', name: 'Rose', color: '#fb7185', borderColor: '#f43f5e' },
		{ id: 'blue', name: 'Ocean', color: '#60a5fa', borderColor: '#3b82f6' },
		{ id: 'green', name: 'Mint', color: '#34d399', borderColor: '#10b981' },
		{ id: 'purple', name: 'Violet', color: '#a78bfa', borderColor: '#8b5cf6' }
	];

	let selected = $derived(photoStore.selectedFrame || 'none');

	function selectFrame(id: string) {
		photoStore.setFrame(id === 'none' ? undefined : id);
	}
</script>

<div class="frame-selector">
	<div class="selector-header">
		<h3>Frame Color</h3>
		<span class="selected-label">{frames.find((f) => f.id === selected)?.name || 'None'}</span>
	</div>
	<div class="frame-options">
		{#each frames as frame (frame.id)}
			<button
				class="frame-option"
				class:selected={frame.id === selected}
				onclick={() => selectFrame(frame.id)}
				type="button"
				title={frame.name}
				aria-label="Select {frame.name} frame"
			>
				<span
					class="frame-swatch"
					class:none={frame.id === 'none'}
					style="--swatch-color: {frame.color}; --swatch-border: {frame.borderColor}"
				>
					{#if frame.id === selected}
						<span class="check-indicator">
							<Check size={12} strokeWidth={3} />
						</span>
					{/if}
				</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.frame-selector {
		background: var(--bg-secondary);
		border-radius: 1.25rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.selector-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-tertiary);
	}

	.selector-header h3 {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
	}

	.selected-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent);
		padding: 0.25rem 0.625rem;
		background: rgba(var(--accent-rgb), 0.1);
		border-radius: 6px;
	}

	.frame-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem;
		justify-content: center;
	}

	.frame-option {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: transform 0.2s var(--ease-out-back);
		position: relative;
	}

	.frame-option:hover {
		transform: scale(1.15);
	}

	.frame-option:active {
		transform: scale(1.05);
	}

	.frame-option.selected {
		z-index: 1;
	}

	.frame-swatch {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--swatch-color);
		border: 3px solid var(--swatch-border);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: all 0.2s var(--ease-out-expo);
		position: relative;
	}

	.frame-swatch.none {
		background: linear-gradient(
			135deg,
			var(--bg-tertiary) 0%,
			var(--bg-tertiary) 45%,
			#ef4444 45%,
			#ef4444 55%,
			var(--bg-tertiary) 55%
		);
	}

	.frame-option.selected .frame-swatch {
		box-shadow:
			0 0 0 3px var(--bg-secondary),
			0 0 0 5px var(--accent),
			0 4px 12px rgba(0, 0, 0, 0.15);
		transform: scale(1.05);
	}

	.check-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		background: var(--accent);
		color: white;
		border-radius: 50%;
		animation: checkPop 0.3s var(--ease-out-back);
	}

	@keyframes checkPop {
		0% {
			transform: scale(0);
		}
		70% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}

	@media (max-width: 480px) {
		.frame-option {
			width: 36px;
			height: 36px;
		}

		.check-indicator {
			width: 16px;
			height: 16px;
		}

		.check-indicator :global(svg) {
			width: 10px;
			height: 10px;
		}
	}
</style>
