<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { createPhotoStrip, downloadImage } from '$lib/utils/canvas';
	import type { PhotoStrip } from '$lib/types/photo';
	import { Download, Trash2, Image as ImageIcon, Layers, ArrowDownToLine } from 'lucide-svelte';

	let strips = $derived(photoStore.photoStrips);
	let downloading = $state<string | null>(null);

	async function downloadStrip(strip: PhotoStrip) {
		downloading = strip.id;
		try {
			const stripDataUrl = await createPhotoStrip(
				strip.photos,
				strip.layout,
				strip.frame,
				strip.background
			);
			downloadImage(stripDataUrl, `photobooth-${strip.id}.png`);
		} finally {
			downloading = null;
		}
	}

	function deleteStrip(id: string) {
		photoStore.removePhotoStrip(id);
	}

	async function downloadAll() {
		for (let i = 0; i < strips.length; i++) {
			await downloadStrip(strips[i]);
			await new Promise((r) => setTimeout(r, 300));
		}
	}
</script>

<div class="gallery">
	<div class="gallery-header">
		<div class="header-info">
			<div class="header-icon">
				<Layers size={20} strokeWidth={2} />
			</div>
			<div class="header-text">
				<h2>Your Gallery</h2>
				<span class="strip-count">{strips.length} {strips.length === 1 ? 'strip' : 'strips'}</span>
			</div>
		</div>
		{#if strips.length > 0}
			<button
				class="download-all-btn"
				onclick={downloadAll}
				disabled={downloading !== null}
				type="button"
			>
				<ArrowDownToLine size={16} strokeWidth={2} />
				<span>Download All</span>
			</button>
		{/if}
	</div>

	{#if strips.length === 0}
		<div class="empty-gallery">
			<div class="empty-illustration">
				<div class="empty-stack">
					<div class="empty-card card-1"></div>
					<div class="empty-card card-2"></div>
					<div class="empty-card card-3">
						<ImageIcon size={32} strokeWidth={1.5} />
					</div>
				</div>
			</div>
			<div class="empty-content">
				<h3>No photo strips yet</h3>
				<p>Capture some photos to create your first strip!</p>
			</div>
		</div>
	{:else}
		<div class="gallery-grid">
			{#each strips as strip, index (strip.id)}
				<div
					class="gallery-item"
					class:downloading={downloading === strip.id}
					style="animation-delay: {index * 0.05}s"
				>
					<div class="gallery-item-image">
						<div class="image-stack">
							{#each strip.photos.slice(0, 3) as photo, i (photo.id)}
								<img
									src={photo.dataUrl}
									alt=""
									class="stack-image"
									style="--stack-index: {i}; --total: {Math.min(strip.photos.length, 3)}"
								/>
							{/each}
						</div>
						{#if strip.photos.length > 1}
							<div class="photos-badge">
								<ImageIcon size={12} strokeWidth={2.5} />
								<span>{strip.photos.length}</span>
							</div>
						{/if}
						<div class="gallery-item-overlay">
							<button
								class="action-btn action-download"
								onclick={() => downloadStrip(strip)}
								disabled={downloading !== null}
								title="Download"
								type="button"
								aria-label="Download photo strip"
							>
								{#if downloading === strip.id}
									<span class="spinner"></span>
								{:else}
									<Download size={18} strokeWidth={2.5} />
								{/if}
							</button>
							<button
								class="action-btn action-delete"
								onclick={() => deleteStrip(strip.id)}
								title="Delete"
								type="button"
								aria-label="Delete photo strip"
							>
								<Trash2 size={18} strokeWidth={2.5} />
							</button>
						</div>
					</div>
					<div class="gallery-item-info">
						<span class="layout-badge">{strip.layout === 'strip-2x2' ? '2×2' : '4×1'}</span>
						<span class="date-label">Just now</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gallery {
		background: var(--bg-secondary);
		border-radius: 1.5rem;
		border: 1px solid var(--border-color);
		overflow: hidden;
		box-shadow: var(--shadow-md);
	}

	.gallery-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-tertiary);
	}

	.header-info {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}

	.header-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--bg-secondary);
		border-radius: 12px;
		color: var(--accent);
	}

	.header-text {
		display: flex;
		flex-direction: column;
	}

	.gallery-header h2 {
		font-family: var(--font-display);
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
	}

	.strip-count {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.download-all-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: 10px;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s var(--ease-out-expo);
	}

	.download-all-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
	}

	.download-all-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.download-all-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Empty state */
	.empty-gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		text-align: center;
	}

	.empty-illustration {
		margin-bottom: 1.5rem;
	}

	.empty-stack {
		position: relative;
		width: 120px;
		height: 100px;
	}

	.empty-card {
		position: absolute;
		width: 80px;
		height: 60px;
		border-radius: 8px;
		background: var(--bg-tertiary);
		border: 2px dashed var(--border-color);
	}

	.empty-card.card-1 {
		top: 0;
		left: 0;
		transform: rotate(-8deg);
		opacity: 0.4;
	}

	.empty-card.card-2 {
		top: 10px;
		left: 15px;
		transform: rotate(-3deg);
		opacity: 0.6;
	}

	.empty-card.card-3 {
		top: 20px;
		left: 30px;
		transform: rotate(2deg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
	}

	.empty-content h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.empty-content p {
		font-size: 0.9rem;
		color: var(--text-muted);
		margin: 0;
	}

	/* Gallery grid */
	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1.25rem;
		padding: 1.5rem;
	}

	.gallery-item {
		background: var(--bg-primary);
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		transition: all 0.3s var(--ease-out-expo);
		border: 1px solid var(--border-color);
		animation: fadeSlideIn 0.4s var(--ease-out-expo) both;
	}

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.gallery-item:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.gallery-item.downloading {
		opacity: 0.7;
		pointer-events: none;
	}

	.gallery-item-image {
		position: relative;
		aspect-ratio: 4/3;
		overflow: hidden;
		background: var(--bg-tertiary);
	}

	.image-stack {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.stack-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all 0.3s var(--ease-out-expo);
	}

	.stack-image:nth-child(1) {
		z-index: 3;
	}

	.stack-image:nth-child(2) {
		z-index: 2;
		opacity: 0;
	}

	.stack-image:nth-child(3) {
		z-index: 1;
		opacity: 0;
	}

	.gallery-item:hover .stack-image:nth-child(1) {
		transform: translateX(-10%) rotate(-3deg);
	}

	.gallery-item:hover .stack-image:nth-child(2) {
		opacity: 0.8;
		transform: translateX(5%) rotate(2deg);
	}

	.photos-badge {
		position: absolute;
		top: 0.625rem;
		left: 0.625rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		padding: 0.375rem 0.625rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		backdrop-filter: blur(8px);
		z-index: 5;
	}

	.gallery-item-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.625rem;
		opacity: 0;
		transition: opacity 0.2s var(--ease-out-expo);
		z-index: 10;
	}

	.gallery-item:hover .gallery-item-overlay {
		opacity: 1;
	}

	.action-btn {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: all 0.2s var(--ease-out-back);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-download {
		background: white;
		color: var(--accent);
	}

	.action-download:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
	}

	.action-delete {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.action-delete:hover {
		background: #ef4444;
		transform: scale(1.1);
	}

	.gallery-item-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
	}

	.layout-badge {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--accent);
		padding: 0.25rem 0.5rem;
		background: rgba(var(--accent-rgb), 0.1);
		border-radius: 6px;
	}

	.date-label {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(var(--accent-rgb), 0.3);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.gallery-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.download-all-btn {
			width: 100%;
			justify-content: center;
		}

		.gallery-grid {
			grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
			gap: 1rem;
			padding: 1rem;
		}
	}
</style>
