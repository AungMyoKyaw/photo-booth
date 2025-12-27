<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';

	const frames = [
		{ id: 'none', name: 'None', color: 'transparent', borderColor: 'var(--border-color)' },
		{ id: 'white', name: 'White', color: '#ffffff', borderColor: '#e5e5e5' },
		{ id: 'black', name: 'Black', color: '#1a1a1a', borderColor: '#000000' },
		{ id: 'gold', name: 'Gold', color: '#ffd700', borderColor: '#daa520' },
		{ id: 'silver', name: 'Silver', color: '#c0c0c0', borderColor: '#a0a0a0' },
		{ id: 'rose', name: 'Rose', color: '#ff007f', borderColor: '#cc0066' },
		{ id: 'blue', name: 'Blue', color: '#007bff', borderColor: '#0056b3' },
		{ id: 'green', name: 'Green', color: '#28a745', borderColor: '#1e7e34' },
		{ id: 'purple', name: 'Purple', color: '#6f42c1', borderColor: '#59359a' }
	];

	let selected = $derived(photoStore.selectedFrame || 'none');

	function selectFrame(id: string) {
		photoStore.setFrame(id === 'none' ? undefined : id);
	}
</script>

<div class="frame-selector">
	<h3>Frame Color</h3>
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
					style="background-color: {frame.color}; border-color: {frame.borderColor}"
				></span>
			</button>
		{/each}
	</div>
	<div class="frame-label">
		{frames.find((f) => f.id === selected)?.name || 'None'}
	</div>
</div>

<style>
	.frame-selector {
		background: var(--bg-primary);
		border-radius: 1rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
	}

	h3 {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.75rem 0;
		color: var(--text-primary);
	}

	.frame-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.frame-option {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		padding: 0;
		background: var(--bg-secondary);
		border: 2px solid transparent;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.frame-option:hover {
		transform: scale(1.1);
	}

	.frame-option:active {
		transform: scale(1.05);
	}

	.frame-option.selected {
		border-color: var(--accent);
		box-shadow:
			0 0 0 2px var(--bg-primary),
			0 0 0 4px var(--accent);
		animation: selectPulse 0.3s ease-out;
	}

	@keyframes selectPulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			transform: scale(1);
		}
	}

	.frame-swatch {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2px solid;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.frame-label {
		margin-top: 0.75rem;
		text-align: center;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary);
		padding: 0.375rem 0.75rem;
		background: var(--bg-secondary);
		border-radius: 0.5rem;
	}

	@media (max-width: 480px) {
		.frame-options {
			justify-content: center;
		}
	}
</style>
