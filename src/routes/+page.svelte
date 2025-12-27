<script lang="ts">
	import Camera from '$lib/components/Camera.svelte';
	import Countdown from '$lib/components/Countdown.svelte';
	import PhotoStrip from '$lib/components/PhotoStrip.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LayoutSelector from '$lib/components/LayoutSelector.svelte';
	import FrameSelector from '$lib/components/FrameSelector.svelte';
	import { photoStore } from '$lib/stores/photos.svelte';
	import { createPhotoStrip, downloadImage, generateDemoPhoto } from '$lib/utils/canvas';
	import type { Photo } from '$lib/types/photo';
	import {
		Camera as CameraIcon,
		Images as GalleryIcon,
		Download as DownloadIcon,
		X as XIcon,
		FlaskConical as DemoIcon
	} from 'lucide-svelte';

	let cameraCapture: (() => Promise<string | null>) | null = null;
	let showCountdown = $state(false);
	let capturing = $state(false);
	let activeTab = $state<'camera' | 'gallery'>('camera');
	let demoMode = $state(false);
	let downloading = $state(false);

	function addDemoPhoto() {
		if (!photoStore.canCapture) return;
		const photo: Photo = {
			id: crypto.randomUUID(),
			dataUrl: generateDemoPhoto(photoStore.captureCount),
			timestamp: Date.now(),
			filter: 'none',
			stickers: []
		};
		photoStore.addPhoto(photo);
	}

	async function startCapture() {
		if (!photoStore.canCapture || capturing) return;

		capturing = true;
		showCountdown = true;
	}

	async function onCountdownComplete() {
		const dataUrl = cameraCapture ? await cameraCapture() : null;
		if (dataUrl) {
			const photo: Photo = {
				id: crypto.randomUUID(),
				dataUrl,
				timestamp: Date.now(),
				filter: 'none',
				stickers: []
			};
			photoStore.addPhoto(photo);
		}
		capturing = false;
		showCountdown = false;
	}

	async function createAndDownloadStrip() {
		if (photoStore.photos.length === 0 || downloading) return;

		downloading = true;
		try {
			const strip = photoStore.createPhotoStrip();
			const stripDataUrl = await createPhotoStrip(
				strip.photos,
				strip.layout,
				strip.frame,
				strip.background
			);
			downloadImage(stripDataUrl, `photobooth-${Date.now()}.png`);
		} finally {
			downloading = false;
		}
	}

	function resetPhotos() {
		photoStore.clearPhotos();
	}
</script>

<svelte:head>
	<title>Photo Booth</title>
	<meta name="description" content="A beautiful web-based photo booth" />
</svelte:head>

<div class="app">
	<header class="header">
		<div class="header-content">
			<div class="logo">
				<CameraIcon size={24} strokeWidth={2} />
				<h1 class="title">Photo Booth</h1>
			</div>
			<div class="tabs">
				<button
					class="tab demo-toggle"
					class:active={demoMode}
					onclick={() => (demoMode = !demoMode)}
					type="button"
					title="Demo mode uses placeholder images"
				>
					<DemoIcon size={18} />
					<span>Demo</span>
				</button>
				<button
					class="tab"
					class:active={activeTab === 'camera'}
					onclick={() => (activeTab = 'camera')}
					type="button"
				>
					<CameraIcon size={18} />
					<span>Camera</span>
				</button>
				<button
					class="tab"
					class:active={activeTab === 'gallery'}
					onclick={() => (activeTab = 'gallery')}
					type="button"
				>
					<GalleryIcon size={18} />
					<span>Gallery</span>
					{#if photoStore.photoStrips.length > 0}
						<span class="badge">{photoStore.photoStrips.length}</span>
					{/if}
				</button>
			</div>
		</div>
	</header>

	<main class="main">
		{#if activeTab === 'camera'}
			<div class="camera-section">
				<div class="camera-wrapper">
					{#if demoMode}
						<div class="demo-placeholder">
							<DemoIcon size={64} strokeWidth={1.5} />
							<h2>Demo Mode</h2>
							<p>Use placeholder images instead of camera</p>
						</div>
					{:else}
						<Camera
							count={photoStore.captureCount}
							exposeCapture={(fn: () => Promise<string | null>) => (cameraCapture = fn)}
						/>
					{/if}

					<!-- Floating Capture Button -->
					{#if photoStore.canCapture}
						{#if demoMode}
							<button
								class="demo-btn-floating"
								onclick={addDemoPhoto}
								type="button"
								aria-label="Add demo photo {photoStore.captureCount + 1} of 4"
							>
								<div class="demo-ring"></div>
								<div class="demo-inner">
									<DemoIcon size={32} strokeWidth={2.5} />
								</div>
								<span class="capture-count">{photoStore.captureCount + 1}/4</span>
							</button>
						{:else}
							<button
								class="capture-btn-floating"
								onclick={startCapture}
								disabled={capturing}
								type="button"
								aria-label="Take photo {photoStore.captureCount + 1} of 4"
							>
								<div class="capture-ring"></div>
								<div class="capture-inner">
									<CameraIcon size={32} strokeWidth={2.5} />
								</div>
								<span class="capture-count">{photoStore.captureCount + 1}/4</span>
							</button>
						{/if}
					{:else}
						<div class="complete-actions-floating">
							<button
								class="action-btn action-primary"
								class:loading={downloading}
								onclick={createAndDownloadStrip}
								disabled={downloading}
								type="button"
								aria-label="Download photo strip"
							>
								{#if downloading}
									<span class="btn-spinner"></span>
								{:else}
									<DownloadIcon size={24} strokeWidth={2} />
								{/if}
							</button>
							<button
								class="action-btn action-secondary"
								onclick={resetPhotos}
								type="button"
								aria-label="Start over with new photos"
							>
								<XIcon size={24} strokeWidth={2} />
							</button>
						</div>
					{/if}
				</div>

				<div class="controls">
					<div class="control-row">
						<LayoutSelector />
						<FrameSelector />
					</div>

					<PhotoStrip />
				</div>
			</div>
		{:else}
			<div class="gallery-section">
				<Gallery />
			</div>
		{/if}
	</main>

	<footer class="footer">
		<p>
			Made with Svelte 5.
			<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
		</p>
	</footer>
</div>

{#if showCountdown}
	<Countdown onComplete={onCountdownComplete} />
{/if}

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg-primary);
		color: var(--text-primary);
	}

	.header {
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border-color);
		padding: 1rem;
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo :global(svg) {
		color: var(--accent);
	}

	.title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-primary);
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--text-secondary);
	}

	.tab:hover {
		background: var(--bg-primary);
	}

	.tab.active {
		background: var(--accent);
		color: var(--bg-secondary);
	}

	.tab.active :global(svg) {
		color: var(--bg-secondary);
	}

	.badge {
		padding: 0.125rem 0.5rem;
		background: #f43f5e;
		color: #fff;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.main {
		flex: 1;
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.camera-section {
		display: grid;
		gap: 2rem;
	}

	.camera-wrapper {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	/* Floating Capture Button */
	.capture-btn-floating {
		position: fixed;
		bottom: calc(2rem + var(--safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		width: 88px;
		height: 88px;
		border-radius: 50%;
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 100;
	}

	.capture-btn-floating:hover:not(:disabled) {
		transform: translateX(-50%) scale(1.08);
		box-shadow: 0 12px 48px rgba(239, 68, 68, 0.5);
	}

	.capture-btn-floating:active:not(:disabled) {
		transform: translateX(-50%) scale(1);
	}

	.capture-btn-floating:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.capture-ring {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 3px solid rgba(239, 68, 68, 0.3);
		animation: ringPulse 2s ease-in-out infinite;
	}

	@keyframes ringPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.08);
			opacity: 0;
		}
	}

	.capture-inner {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ef4444;
	}

	.capture-count {
		position: absolute;
		bottom: -2rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	/* Demo Button */
	.demo-btn-floating {
		position: fixed;
		bottom: calc(2rem + var(--safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		width: 88px;
		height: 88px;
		border-radius: 50%;
		background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 100;
	}

	.demo-btn-floating:hover {
		transform: translateX(-50%) scale(1.08);
		box-shadow: 0 12px 48px rgba(139, 92, 246, 0.5);
	}

	.demo-btn-floating:active {
		transform: translateX(-50%) scale(1);
	}

	.demo-ring {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 3px solid rgba(139, 92, 246, 0.3);
		animation: ringPulse 2s ease-in-out infinite;
	}

	.demo-inner {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #8b5cf6;
	}

	/* Demo Placeholder */
	.demo-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		border-radius: 1rem;
		min-height: 400px;
	}

	.demo-placeholder :global(svg) {
		color: #8b5cf6;
	}

	.demo-placeholder h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		color: #fff;
	}

	.demo-placeholder p {
		font-size: 1rem;
		margin: 0;
		color: rgba(255, 255, 255, 0.7);
	}

	.demo-toggle {
		background: rgba(139, 92, 246, 0.1);
		color: #8b5cf6;
	}

	.demo-toggle:hover {
		background: rgba(139, 92, 246, 0.2);
	}

	.demo-toggle.active {
		background: #8b5cf6;
		color: #fff;
	}

	/* Complete Actions Floating */
	.complete-actions-floating {
		position: fixed;
		bottom: calc(2rem + var(--safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.75rem;
		z-index: 100;
	}

	.action-btn {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	:global(.dark) .action-btn {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	}

	.action-btn:hover {
		transform: scale(1.1);
	}

	.action-primary {
		background: var(--accent);
		color: var(--bg-secondary);
	}

	.action-primary :global(svg) {
		color: var(--bg-secondary);
	}

	.action-secondary {
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
	}

	.action-secondary :global(svg) {
		color: var(--text-secondary);
	}

	/* Loading state for action buttons */
	.action-btn.loading {
		pointer-events: none;
		opacity: 0.8;
	}

	.btn-spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.controls {
		display: grid;
		gap: 1rem;
		max-width: 800px;
		margin: 0 auto;
		padding-bottom: calc(8rem + var(--safe-area-inset-bottom));
	}

	.control-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.gallery-section {
		max-width: 1000px;
		margin: 0 auto;
	}

	.footer {
		padding: 2rem;
		padding-bottom: calc(6rem + var(--safe-area-inset-bottom));
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.footer a {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}

	.footer a:hover {
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.control-row {
			grid-template-columns: 1fr;
		}

		.header-content {
			flex-direction: column;
			gap: 1rem;
		}

		.capture-btn-floating {
			width: 72px;
			height: 72px;
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
		}

		.capture-inner {
			width: 60px;
			height: 60px;
		}

		.capture-inner :global(svg) {
			width: 24px;
			height: 24px;
		}

		.demo-btn-floating {
			width: 72px;
			height: 72px;
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
		}

		.demo-inner {
			width: 60px;
			height: 60px;
		}

		.demo-inner :global(svg) {
			width: 24px;
			height: 24px;
		}

		.complete-actions-floating {
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
		}

		.footer {
			padding-bottom: calc(5rem + var(--safe-area-inset-bottom));
		}
	}
</style>
