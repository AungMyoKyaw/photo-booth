<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { Camera, X } from 'lucide-svelte';

	function removePhoto(id: string) {
		photoStore.removePhoto(id);
	}
</script>

<div class="photo-strip">
	<div class="strip-preview" class:horizontal={photoStore.currentLayout === 'strip-4x1'}>
		{#if photoStore.photos.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<Camera size={40} strokeWidth={1.5} />
				</div>
				<p>Take up to 4 photos</p>
				<div class="empty-slots-preview">
					{#if photoStore.currentLayout === 'strip-4x1'}
						<div class="preview-horizontal">
							{#each Array(4) as _, i (`preview-h-${i}`)}
								<!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
								<div class="preview-slot"></div>
							{/each}
						</div>
					{:else}
						<div class="preview-grid">
							{#each Array(4) as _, i (`preview-g-${i}`)}
								<!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
								<div class="preview-slot"></div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if photoStore.currentLayout === 'strip-4x1'}
			<div class="strip-horizontal">
				{#each photoStore.photos as photo (photo.id)}
					<div class="photo-item">
						<img src={photo.dataUrl} alt="" />
						<button
							class="remove-btn"
							onclick={() => removePhoto(photo.id)}
							title="Remove photo"
							type="button"
							aria-label="Remove photo"
						>
							<X size={14} strokeWidth={2.5} />
						</button>
					</div>
				{/each}
				{#each Array(4 - photoStore.photos.length) as _, i (`empty-${i}`)}
					<!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
					<div class="photo-slot empty">
						<span class="slot-number">{photoStore.photos.length + i + 1}</span>
					</div>
				{/each}
			</div>
		{:else}
			<div class="strip-grid">
				{#each photoStore.photos as photo (photo.id)}
					<div class="photo-item">
						<img src={photo.dataUrl} alt="" />
						<button
							class="remove-btn"
							onclick={() => removePhoto(photo.id)}
							title="Remove photo"
							type="button"
							aria-label="Remove photo"
						>
							<X size={14} strokeWidth={2.5} />
						</button>
					</div>
				{/each}
				{#each Array(4 - photoStore.photos.length) as _, i (`empty-${i}`)}
					<!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
					<div class="photo-slot empty">
						<span class="slot-number">{photoStore.photos.length + i + 1}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.photo-strip {
		background: var(--bg-primary);
		border-radius: 1rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
	}

	.strip-preview {
		background: var(--bg-secondary);
		border-radius: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
	}

	.strip-preview.horizontal {
		/* Horizontal layout - no special height needed */
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem;
		color: var(--text-secondary);
	}

	.empty-icon {
		width: 40px;
		height: 40px;
		color: var(--text-secondary);
		opacity: 0.5;
	}

	.empty-state p {
		margin: 0;
		font-size: 0.875rem;
	}

	.empty-slots-preview {
		margin-top: 0.5rem;
		opacity: 0.6;
	}

	.preview-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.375rem;
	}

	.preview-horizontal {
		display: flex;
		gap: 0.375rem;
	}

	.preview-slot {
		width: 32px;
		height: 32px;
		border-radius: 0.25rem;
		background: var(--border-color);
		border: 1.5px dashed var(--border-color);
	}

	.preview-horizontal .preview-slot {
		width: 24px;
	}

	.strip-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
		/* Let content determine height - no fixed aspect ratio */
	}

	.strip-horizontal {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		/* Let content determine height - no fixed aspect ratio */
		padding-bottom: 0.5rem;
		max-height: 100%;
	}

	/* Custom scrollbar for horizontal strip */
	.strip-horizontal::-webkit-scrollbar {
		height: 4px;
	}

	.strip-horizontal::-webkit-scrollbar-track {
		background: var(--bg-primary);
		border-radius: 2px;
	}

	.strip-horizontal::-webkit-scrollbar-thumb {
		background: var(--border-color);
		border-radius: 2px;
	}

	.strip-horizontal::-webkit-scrollbar-thumb:hover {
		background: var(--text-secondary);
	}

	.photo-item {
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--border-color);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Grid layout - square aspect ratio for 2x2 */
	.strip-grid .photo-item {
		aspect-ratio: 1/1;
	}

	/* Horizontal layout - 4:3 aspect ratio */
	.strip-horizontal .photo-item {
		flex-shrink: 0;
		width: 140px;
		aspect-ratio: 4/3;
	}

	.photo-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.remove-btn {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: rgba(244, 63, 94, 0.95);
		border: none;
		color: #fff;
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.2s,
			transform 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
	}

	.remove-btn:hover {
		transform: scale(1.1);
		background: rgba(244, 63, 94, 1);
	}

	.photo-item:hover .remove-btn {
		opacity: 1;
	}

	/* Always show remove button on touch devices */
	@media (hover: none) {
		.remove-btn {
			opacity: 1;
		}
	}

	.photo-slot.empty {
		background: var(--bg-primary);
		border: 2px dashed var(--border-color);
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.photo-slot.empty:hover {
		border-color: var(--accent);
		background: rgba(var(--accent-rgb, 99, 102, 241), 0.05);
	}

	.strip-grid .photo-slot.empty {
		aspect-ratio: 1/1;
	}

	.strip-horizontal .photo-slot.empty {
		flex-shrink: 0;
		width: 140px;
		aspect-ratio: 4/3;
	}

	.slot-number {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--border-color);
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.strip-preview {
			padding: 0.75rem;
		}

		.strip-horizontal .photo-item,
		.strip-horizontal .photo-slot.empty {
			width: 100px;
		}

		.slot-number {
			font-size: 1.25rem;
		}
	}
</style>
