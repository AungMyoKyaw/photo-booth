<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { Square, RectangleHorizontal } from 'lucide-svelte';

	type Layout = 'strip-2x2' | 'strip-4x1';

	let selected = $derived(photoStore.currentLayout);

	function selectLayout(id: Layout) {
		photoStore.setLayout(id);
	}
</script>

<div class="layout-selector">
	<h3>Layout</h3>
	<div class="layout-options">
		<button
			class="layout-option"
			class:selected={selected === 'strip-2x2'}
			onclick={() => selectLayout('strip-2x2')}
			type="button"
		>
			<span class="layout-icon">
				<Square size={24} strokeWidth={2} />
			</span>
			<div class="layout-info">
				<span class="layout-name">2×2 Grid</span>
				<span class="layout-desc">Compact square layout</span>
			</div>
		</button>
		<button
			class="layout-option"
			class:selected={selected === 'strip-4x1'}
			onclick={() => selectLayout('strip-4x1')}
			type="button"
		>
			<span class="layout-icon">
				<RectangleHorizontal size={24} strokeWidth={2} />
			</span>
			<div class="layout-info">
				<span class="layout-name">4×1 Strip</span>
				<span class="layout-desc">Full-size horizontal strip</span>
			</div>
		</button>
	</div>
</div>

<style>
	.layout-selector {
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

	.layout-options {
		display: flex;
		gap: 0.5rem;
	}

	.layout-option {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-secondary);
		border: 2px solid transparent;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		color: var(--text-primary);
		position: relative;
		overflow: hidden;
	}

	.layout-option:hover {
		background: var(--bg-primary);
		transform: translateY(-1px);
	}

	.layout-option.selected {
		border-color: var(--accent);
		background: var(--bg-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .layout-option.selected {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.layout-option:active {
		transform: translateY(0);
	}

	.layout-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		color: var(--accent);
		border-radius: 0.375rem;
		background: var(--bg-primary);
		transition: transform 0.2s;
	}

	.layout-option:hover .layout-icon {
		transform: scale(1.05);
	}

	.layout-icon :global(svg) {
		width: 20px;
		height: 20px;
	}

	.layout-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.layout-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.layout-desc {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
</style>
