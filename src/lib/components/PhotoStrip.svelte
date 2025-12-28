<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { Camera, X, ImageIcon } from 'lucide-svelte';

	function removePhoto(id: string) {
		photoStore.removePhoto(id);
	}
</script>

<div class="photo-strip">
	<div class="strip-header">
		<div class="strip-icon">
			<ImageIcon size={18} strokeWidth={2} />
		</div>
		<h3>Photo Preview</h3>
		<span class="photo-count">{photoStore.photos.length}/4</span>
	</div>

	<div class="strip-preview" class:horizontal={photoStore.currentLayout === 'strip-4x1'}>
		{#if photoStore.photos.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<Camera size={32} strokeWidth={1.5} />
				</div>
				<p>Your photos will appear here</p>
				<div class="empty-slots-preview">
					{#if photoStore.currentLayout === 'strip-4x1'}
						<div class="preview-horizontal">
							{#each Array(4) as _slot, i (`preview-h-${i}`)}
								<div class="preview-slot">
									<span>{i + 1}</span>
								</div>
							{/each}
						</div>
					{:else}
						<div class="preview-grid">
							{#each Array(4) as _slot, i (`preview-g-${i}`)}
								<div class="preview-slot">
									<span>{i + 1}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if photoStore.currentLayout === 'strip-4x1'}
			<div class="strip-horizontal">
				{#each photoStore.photos as photo, index (photo.id)}
					<div class="photo-item" style="animation-delay: {index * 0.05}s">
						<img src={photo.dataUrl} alt="Photo {index + 1}" />
						<button
							class="remove-btn"
							onclick={() => removePhoto(photo.id)}
							title="Remove photo"
							type="button"
							aria-label="Remove photo"
						>
							<X size={12} strokeWidth={3} />
						</button>
						<span class="photo-number">{index + 1}</span>
					</div>
				{/each}
				{#each Array(4 - photoStore.photos.length) as _empty, i (`empty-${i}`)}
					<div class="photo-slot empty">
						<span class="slot-number">{photoStore.photos.length + i + 1}</span>
					</div>
				{/each}
			</div>
		{:else}
			<div class="strip-grid">
				{#each photoStore.photos as photo, index (photo.id)}
					<div class="photo-item" style="animation-delay: {index * 0.05}s">
						<img src={photo.dataUrl} alt="Photo {index + 1}" />
						<button
							class="remove-btn"
							onclick={() => removePhoto(photo.id)}
							title="Remove photo"
							type="button"
							aria-label="Remove photo"
						>
							<X size={12} strokeWidth={3} />
						</button>
						<span class="photo-number">{index + 1}</span>
					</div>
				{/each}
				{#each Array(4 - photoStore.photos.length) as _empty, i (`empty-${i}`)}
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
		background: var(--bg-secondary);
		border-radius: 1.25rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.strip-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-tertiary);
	}

	.strip-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--bg-secondary);
		border-radius: 8px;
		color: var(--accent);
	}

	.strip-header h3 {
		flex: 1;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
	}

	.photo-count {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		padding: 0.25rem 0.5rem;
		background: var(--bg-secondary);
		border-radius: 6px;
	}

	.strip-preview {
		padding: 1rem;
	}

	.strip-preview.horizontal {
		overflow-x: auto;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1.5rem 1rem;
		color: var(--text-secondary);
	}

	.empty-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		background: var(--bg-tertiary);
		border-radius: 16px;
		color: var(--text-muted);
	}

	.empty-state p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.empty-slots-preview {
		margin-top: 0.5rem;
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
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: var(--bg-tertiary);
		border: 2px dashed var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.preview-slot span {
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 700;
		color: var(--text-muted);
	}

	.preview-horizontal .preview-slot {
		width: 32px;
		height: 32px;
	}

	.strip-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.625rem;
	}

	.strip-horizontal {
		display: flex;
		gap: 0.625rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
		scroll-snap-type: x mandatory;
	}

	.strip-horizontal::-webkit-scrollbar {
		height: 6px;
	}

	.strip-horizontal::-webkit-scrollbar-track {
		background: var(--bg-tertiary);
		border-radius: 3px;
	}

	.strip-horizontal::-webkit-scrollbar-thumb {
		background: var(--border-color);
		border-radius: 3px;
	}

	.strip-horizontal::-webkit-scrollbar-thumb:hover {
		background: var(--text-muted);
	}

	.photo-item {
		position: relative;
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-tertiary);
		box-shadow: var(--shadow-sm);
		animation: photoSlideIn 0.4s var(--ease-out-back) both;
		scroll-snap-align: start;
	}

	@keyframes photoSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.strip-grid .photo-item {
		aspect-ratio: 1/1;
	}

	.strip-horizontal .photo-item {
		flex-shrink: 0;
		width: 140px;
		aspect-ratio: 4/3;
	}

	.photo-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s var(--ease-out-expo);
	}

	.photo-item:hover img {
		transform: scale(1.05);
	}

	.photo-number {
		position: absolute;
		bottom: 0.375rem;
		left: 0.375rem;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		font-weight: 700;
		border-radius: 6px;
		backdrop-filter: blur(4px);
	}

	.remove-btn {
		position: absolute;
		top: 0.375rem;
		right: 0.375rem;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: rgba(239, 68, 68, 0.9);
		border: none;
		color: #fff;
		cursor: pointer;
		opacity: 0;
		transition: all 0.2s var(--ease-out-expo);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
		transform: scale(0.8);
	}

	.remove-btn:hover {
		background: #ef4444;
		transform: scale(1.1);
	}

	.photo-item:hover .remove-btn {
		opacity: 1;
		transform: scale(1);
	}

	@media (hover: none) {
		.remove-btn {
			opacity: 1;
			transform: scale(1);
		}
	}

	.photo-slot.empty {
		background: var(--bg-tertiary);
		border: 2px dashed var(--border-color);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s var(--ease-out-expo);
	}

	.photo-slot.empty:hover {
		border-color: var(--accent);
		background: rgba(var(--accent-rgb), 0.05);
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
		font-family: var(--font-mono);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--border-color);
	}

	@media (max-width: 480px) {
		.strip-preview {
			padding: 0.75rem;
		}

		.strip-horizontal .photo-item,
		.strip-horizontal .photo-slot.empty {
			width: 110px;
		}

		.slot-number {
			font-size: 1rem;
		}
	}
</style>
