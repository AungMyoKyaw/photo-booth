<script lang="ts">
	import { photoStore } from '$lib/stores/photos.svelte';
	import { createPhotoStrip, downloadImage } from '$lib/utils/canvas';
	import type { PhotoStrip } from '$lib/types/photo';
	import { Download, Trash2, Image as ImageIcon } from 'lucide-svelte';

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
			// Small delay between downloads
			await new Promise((r) => setTimeout(r, 300));
		}
	}
</script>

<div class="gallery">
	<div class="gallery-header">
		<h2>Gallery</h2>
		{#if strips.length > 0}
			<button
				class="download-all-btn"
				onclick={downloadAll}
				disabled={downloading !== null}
				type="button"
			>
				<Download size={16} strokeWidth={2} />
				<span>Download All</span>
			</button>
		{/if}
	</div>

	{#if strips.length === 0}
		<div class="empty-gallery">
			<div class="empty-icon">
				<ImageIcon size={64} strokeWidth={1} />
			</div>
			<p>No photo strips yet</p>
			<p class="hint">Capture some photos to create your first strip!</p>
		</div>
	{:else}
		<div class="gallery-grid">
			{#each strips as strip (strip.id)}
				<div class="gallery-item" class:downloading={downloading === strip.id}>
					<div class="gallery-item-image">
						<img src={strip.photos[0].dataUrl} alt="" />
						{#if strip.photos.length > 1}
							<div class="more-photos-badge">+{strip.photos.length - 1}</div>
						{/if}
						<div class="gallery-item-overlay">
							<button
								class="action-btn"
								onclick={() => downloadStrip(strip)}
								disabled={downloading !== null}
								title="Download"
								type="button"
								aria-label="Download photo strip"
							>
								{#if downloading === strip.id}
									<span class="spinner"></span>
								{:else}
									<Download size={20} strokeWidth={2} />
								{/if}
							</button>
							<button
								class="action-btn danger"
								onclick={() => deleteStrip(strip.id)}
								title="Delete"
								type="button"
								aria-label="Delete photo strip"
							>
								<Trash2 size={20} strokeWidth={2} />
							</button>
						</div>
					</div>
					<div class="gallery-item-info">
						<span class="photo-count">{strip.photos.length} photos</span>
						<span class="layout-badge">{strip.layout}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gallery {
		background: var(--bg-primary);
		border-radius: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--border-color);
	}

	.gallery-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.gallery-header h2 {
		font-size: 1.25rem;
		margin: 0;
		color: var(--text-primary);
	}

	.download-all-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--accent);
		color: var(--bg-secondary);
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.download-all-btn:hover {
		opacity: 0.9;
	}

	.empty-gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem;
		text-align: center;
	}

	.empty-icon {
		width: 64px;
		height: 64px;
		margin-bottom: 1rem;
		color: var(--text-secondary);
		opacity: 0.5;
	}

	.hint {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.gallery-item {
		background: var(--bg-secondary);
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		border: 1px solid var(--border-color);
	}

	:global(.dark) .gallery-item {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.gallery-item:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	}

	:global(.dark) .gallery-item:hover {
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	}

	.gallery-item-image {
		position: relative;
		aspect-ratio: 4/3;
		overflow: hidden;
	}

	.gallery-item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.more-photos-badge {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		padding: 0.25rem 0.5rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		backdrop-filter: blur(8px);
	}

	.gallery-item-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.gallery-item:hover .gallery-item-overlay {
		opacity: 1;
	}

	.action-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.action-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.action-btn.danger:hover {
		background: #f43f5e;
	}

	.gallery-item-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		font-size: 0.75rem;
		background: var(--bg-secondary);
	}

	.photo-count {
		color: var(--text-secondary);
	}

	.layout-badge {
		padding: 0.25rem 0.5rem;
		background: var(--bg-primary);
		border-radius: 999px;
		font-weight: 500;
		color: var(--text-primary);
	}

	.gallery-item.downloading {
		opacity: 0.7;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
