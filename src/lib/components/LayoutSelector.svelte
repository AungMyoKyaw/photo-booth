<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { LayoutGrid, LayoutList, Check } from 'lucide-svelte';

	type Layout = 'strip-2x2' | 'strip-4x1';

	let selected = $derived(photoStore.currentLayout);

	function selectLayout(id: Layout) {
		photoStore.setLayout(id);
	}
</script>

<div class="layout-selector">
	<div class="selector-header">
		<h3>Layout</h3>
	</div>
	<div class="layout-options">
		<button
			class="layout-option"
			class:selected={selected === 'strip-2x2'}
			onclick={() => selectLayout('strip-2x2')}
			type="button"
		>
			<span class="layout-icon">
				<LayoutGrid size={20} strokeWidth={2} />
			</span>
			<div class="layout-info">
				<span class="layout-name">2×2 Grid</span>
				<span class="layout-desc">Square layout</span>
			</div>
			{#if selected === 'strip-2x2'}
				<span class="check-icon">
					<Check size={16} strokeWidth={3} />
				</span>
			{/if}
		</button>
		<button
			class="layout-option"
			class:selected={selected === 'strip-4x1'}
			onclick={() => selectLayout('strip-4x1')}
			type="button"
		>
			<span class="layout-icon">
				<LayoutList size={20} strokeWidth={2} />
			</span>
			<div class="layout-info">
				<span class="layout-name">4×1 Strip</span>
				<span class="layout-desc">Horizontal</span>
			</div>
			{#if selected === 'strip-4x1'}
				<span class="check-icon">
					<Check size={16} strokeWidth={3} />
				</span>
			{/if}
		</button>
	</div>
</div>

<style>
	.layout-selector {
		background: var(--bg-secondary);
		border-radius: 1.25rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.selector-header {
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

	.layout-options {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 0.75rem;
	}

	.layout-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--bg-tertiary);
		border: 2px solid transparent;
		border-radius: 0.875rem;
		cursor: pointer;
		transition: all 0.2s var(--ease-out-expo);
		color: var(--text-primary);
		position: relative;
	}

	.layout-option:hover {
		background: var(--bg-primary);
		border-color: var(--border-color);
	}

	.layout-option.selected {
		background: rgba(var(--accent-rgb), 0.08);
		border-color: var(--accent);
	}

	.layout-option:active {
		transform: scale(0.98);
	}

	.layout-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		color: var(--text-secondary);
		border-radius: 10px;
		background: var(--bg-secondary);
		transition: all 0.2s;
	}

	.layout-option.selected .layout-icon {
		color: var(--accent);
		background: rgba(var(--accent-rgb), 0.1);
	}

	.layout-info {
		flex: 1;
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
		color: var(--text-muted);
	}

	.check-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
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
</style>
