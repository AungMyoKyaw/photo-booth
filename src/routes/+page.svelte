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
		RotateCcw as ResetIcon,
		FlaskConical as DemoIcon,
		Sparkles,
		Github
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
	<title>Photo Booth — Capture Memories</title>
	<meta
		name="description"
		content="A beautiful web-based photo booth with filters, layouts, and instant downloads"
	/>
</svelte:head>

<div class="app">
	<!-- Decorative gradient orb -->
	<div class="ambient-orb ambient-orb-1"></div>
	<div class="ambient-orb ambient-orb-2"></div>

	<header class="header glass">
		<div class="header-content">
			<div class="logo">
				<div class="logo-icon">
					<CameraIcon size={22} strokeWidth={2.5} />
				</div>
				<div class="logo-text">
					<h1 class="title">Photo Booth</h1>
					<span class="tagline">Capture the moment</span>
				</div>
			</div>
			<nav class="tabs">
				<button
					class="tab"
					class:active={demoMode}
					onclick={() => (demoMode = !demoMode)}
					type="button"
					title="Demo mode uses placeholder images"
				>
					<DemoIcon size={18} />
					<span>Demo</span>
				</button>
				<div class="tab-divider"></div>
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
			</nav>
		</div>
	</header>

	<main class="main">
		{#if activeTab === 'camera'}
			<div class="camera-section">
				<div class="camera-wrapper">
					{#if demoMode}
						<div class="demo-placeholder">
							<div class="demo-icon-wrapper">
								<Sparkles size={48} strokeWidth={1.5} />
							</div>
							<h2>Demo Mode</h2>
							<p>Experience the app with colorful placeholder images</p>
							<div class="demo-hint">
								<span>Tap the button below to add photos</span>
							</div>
						</div>
					{:else}
						<Camera
							count={photoStore.captureCount}
							exposeCapture={(fn: () => Promise<string | null>) => (cameraCapture = fn)}
						/>
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

	<!-- Floating Action Button -->
	<div class="fab-container">
		{#if photoStore.canCapture}
			{#if demoMode}
				<button
					class="fab fab-demo"
					onclick={addDemoPhoto}
					type="button"
					aria-label="Add demo photo {photoStore.captureCount + 1} of 4"
				>
					<div class="fab-pulse"></div>
					<div class="fab-inner">
						<DemoIcon size={28} strokeWidth={2} />
					</div>
				</button>
			{:else}
				<button
					class="fab fab-capture"
					onclick={startCapture}
					disabled={capturing}
					type="button"
					aria-label="Take photo {photoStore.captureCount + 1} of 4"
				>
					<div class="fab-pulse"></div>
					<div class="fab-inner">
						<CameraIcon size={28} strokeWidth={2} />
					</div>
				</button>
			{/if}
			<span class="fab-label">{photoStore.captureCount}/4 photos</span>
		{:else}
			<div class="fab-group">
				<button
					class="fab fab-download"
					class:loading={downloading}
					onclick={createAndDownloadStrip}
					disabled={downloading}
					type="button"
					aria-label="Download photo strip"
				>
					{#if downloading}
						<span class="fab-spinner"></span>
					{:else}
						<DownloadIcon size={24} strokeWidth={2} />
					{/if}
				</button>
				<button
					class="fab fab-reset"
					onclick={resetPhotos}
					type="button"
					aria-label="Start over with new photos"
				>
					<ResetIcon size={22} strokeWidth={2} />
				</button>
			</div>
			<span class="fab-label fab-label-complete">Ready to download!</span>
		{/if}
	</div>

	<footer class="footer">
		<div class="footer-content">
			<p class="footer-made">
				Made with <span class="heart">❤️</span> by
				<a href="https://github.com/AungMyoKyaw" target="_blank" rel="noopener">Aung Myo Kyaw</a>
			</p>
			<div class="footer-links">
				<a href="https://svelte.dev" target="_blank" rel="noopener" class="footer-tech">
					Svelte 5
				</a>
				<span class="footer-dot">•</span>
				<a
					href="https://github.com/AungMyoKyaw/photo-booth"
					target="_blank"
					rel="noopener"
					class="footer-github"
				>
					<Github size={16} />
					<span>GitHub</span>
				</a>
			</div>
		</div>
	</footer>
</div>

{#if showCountdown}
	<Countdown onComplete={onCountdownComplete} />
{/if}

<style>
	.app {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
	}

	/* Ambient gradient orbs */
	.ambient-orb {
		position: fixed;
		border-radius: 50%;
		filter: blur(80px);
		pointer-events: none;
		z-index: 0;
	}

	.ambient-orb-1 {
		top: -20%;
		right: -10%;
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, rgba(var(--accent-rgb), 0.12) 0%, transparent 70%);
		animation: float 15s ease-in-out infinite;
	}

	.ambient-orb-2 {
		bottom: -30%;
		left: -20%;
		width: 800px;
		height: 800px;
		background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
		animation: float 20s ease-in-out infinite reverse;
	}

	/* Header */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
		animation: slideDown 0.5s var(--ease-out-expo);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--gradient-accent);
		border-radius: 12px;
		color: white;
		box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
	}

	.logo-text {
		display: flex;
		flex-direction: column;
	}

	.title {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.tagline {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	/* Navigation tabs */
	.tabs {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem;
		background: var(--bg-tertiary);
		border-radius: 12px;
	}

	.tab-divider {
		width: 1px;
		height: 24px;
		background: var(--border-color);
		margin: 0 0.25rem;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.875rem;
		background: transparent;
		border: none;
		border-radius: 8px;
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s var(--ease-out-expo);
		color: var(--text-secondary);
		position: relative;
	}

	.tab:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.tab.active {
		background: var(--bg-secondary);
		color: var(--accent);
		box-shadow: var(--shadow-sm);
	}

	.tab.active :global(svg) {
		color: var(--accent);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 6px;
		background: var(--accent);
		color: white;
		border-radius: 9px;
		font-size: 0.7rem;
		font-weight: 700;
		font-family: var(--font-mono);
	}

	/* Main content */
	.main {
		flex: 1;
		padding: 1.5rem 1rem;
		padding-bottom: calc(10rem + var(--safe-area-inset-bottom));
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		animation: fadeIn 0.6s var(--ease-out-expo);
	}

	.camera-section {
		display: grid;
		gap: 1.5rem;
	}

	.camera-wrapper {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
	}

	/* Demo placeholder */
	.demo-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 4rem 2rem;
		text-align: center;
		background: var(--bg-secondary);
		border: 2px dashed var(--border-color);
		border-radius: 1.5rem;
		min-height: 400px;
		position: relative;
		overflow: hidden;
	}

	.demo-placeholder::before {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--gradient-warm);
		opacity: 0.5;
	}

	.demo-icon-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: var(--gradient-accent);
		border-radius: 24px;
		color: white;
		box-shadow: 0 8px 32px rgba(var(--accent-rgb), 0.3);
		animation: float 3s ease-in-out infinite;
	}

	.demo-placeholder h2 {
		position: relative;
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}

	.demo-placeholder p {
		position: relative;
		font-size: 1rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.demo-hint {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: var(--bg-tertiary);
		border-radius: 999px;
		font-size: 0.875rem;
		color: var(--text-muted);
		margin-top: 0.5rem;
	}

	/* Controls */
	.controls {
		display: grid;
		gap: 1rem;
		max-width: 800px;
		margin: 0 auto;
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

	/* Floating Action Buttons */
	.fab-container {
		position: fixed;
		bottom: calc(2rem + var(--safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		z-index: 100;
	}

	.fab-group {
		display: flex;
		gap: 0.75rem;
	}

	.fab {
		position: relative;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s var(--ease-out-back);
		box-shadow: 0 8px 32px rgba(var(--accent-rgb), 0.3);
	}

	.fab:hover:not(:disabled) {
		transform: scale(1.08);
	}

	.fab:active:not(:disabled) {
		transform: scale(0.98);
	}

	.fab:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.fab-capture {
		background: var(--gradient-accent);
		color: white;
	}

	.fab-demo {
		background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
		color: white;
		box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
	}

	.fab-download {
		background: var(--gradient-accent);
		color: white;
		width: 64px;
		height: 64px;
	}

	.fab-reset {
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		width: 56px;
		height: 56px;
		box-shadow: var(--shadow-lg);
	}

	.fab-reset:hover {
		background: var(--bg-tertiary);
	}

	.fab-pulse {
		position: absolute;
		inset: -6px;
		border-radius: 50%;
		border: 3px solid currentColor;
		opacity: 0.3;
		animation: pulse-ring 2s ease-out infinite;
	}

	.fab-inner {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fab-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--glass-bg);
		backdrop-filter: blur(10px);
		padding: 0.375rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--glass-border);
	}

	.fab-label-complete {
		color: var(--accent);
		background: rgba(var(--accent-rgb), 0.1);
		border-color: rgba(var(--accent-rgb), 0.2);
	}

	.fab-spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Footer */
	.footer {
		padding: 2rem 1rem;
		padding-bottom: calc(6rem + var(--safe-area-inset-bottom));
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.footer-made {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.footer-made a {
		color: var(--text-primary);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s;
	}

	.footer-made a:hover {
		color: var(--accent);
	}

	.heart {
		display: inline-block;
		animation: heartbeat 1.5s ease-in-out infinite;
	}

	@keyframes heartbeat {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
	}

	.footer-links {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.8rem;
	}

	.footer-dot {
		color: var(--text-muted);
	}

	.footer-tech {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.footer-tech:hover {
		color: var(--accent);
	}

	.footer-github {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.footer-github:hover {
		color: var(--text-primary);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.header-content {
			flex-direction: column;
			gap: 0.75rem;
		}

		.control-row {
			grid-template-columns: 1fr;
		}

		.fab {
			width: 64px;
			height: 64px;
		}

		.fab-download {
			width: 56px;
			height: 56px;
		}

		.fab-reset {
			width: 48px;
			height: 48px;
		}

		.fab-container {
			bottom: calc(1.5rem + var(--safe-area-inset-bottom));
		}

		.tab span {
			display: none;
		}

		.tab {
			padding: 0.625rem;
		}

		.tagline {
			display: none;
		}

		.demo-placeholder {
			min-height: 300px;
			padding: 2rem 1rem;
		}

		.ambient-orb-1,
		.ambient-orb-2 {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.main {
			padding: 1rem 0.75rem;
			padding-bottom: calc(9rem + var(--safe-area-inset-bottom));
		}

		.title {
			font-size: 1.125rem;
		}
	}
</style>
