<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { RotateCw, AlertCircle, Camera as CameraIcon } from 'lucide-svelte';

	interface Props {
		count?: number;
		exposeCapture?: (fn: () => Promise<string | null>) => void;
	}

	let { count = 0, exposeCapture }: Props = $props();

	let videoElement = $state<HTMLVideoElement | undefined>();
	let error = $state<string | null>(null);
	let facingMode = $state<'user' | 'environment'>('user');
	let stream: MediaStream | null = null;
	let isLoading = $state(true);

	async function startCamera() {
		isLoading = true;
		try {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}

			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode,
					width: { ideal: 1920 },
					height: { ideal: 1080 }
				},
				audio: false
			});

			stream = mediaStream;
			if (videoElement) {
				videoElement.srcObject = mediaStream;
			}
			error = null;
		} catch (e) {
			error = 'Could not access camera. Please grant permission.';
			console.error('Camera error:', e);
		} finally {
			isLoading = false;
		}
	}

	async function switchCamera() {
		facingMode = facingMode === 'user' ? 'environment' : 'user';
		await startCamera();
	}

	onMount(() => {
		startCamera();
		if (exposeCapture) {
			exposeCapture(capture);
		}
	});

	onDestroy(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
	});

	async function capture(): Promise<string | null> {
		if (!videoElement?.videoWidth || !stream) return null;

		const canvas = document.createElement('canvas');
		canvas.width = videoElement.videoWidth;
		canvas.height = videoElement.videoHeight;
		const ctx = canvas.getContext('2d');

		if (!ctx) return null;

		// Mirror if using front camera
		if (facingMode === 'user') {
			ctx.translate(canvas.width, 0);
			ctx.scale(-1, 1);
		}

		ctx.drawImage(videoElement, 0, 0);

		return canvas.toDataURL('image/png', 0.95);
	}
</script>

<div class="camera-container">
	{#if error}
		<div class="error">
			<div class="error-icon">
				<AlertCircle size={48} strokeWidth={1.5} />
			</div>
			<h3>Camera Access Required</h3>
			<p>{error}</p>
			<button onclick={startCamera} class="retry-btn" type="button">
				<RotateCw size={18} />
				<span>Try Again</span>
			</button>
		</div>
	{:else}
		<div class="video-wrapper">
			{#if isLoading}
				<div class="loading-state">
					<div class="loading-spinner"></div>
					<span>Accessing camera...</span>
				</div>
			{/if}

			<video
				bind:this={videoElement}
				autoplay
				playsinline
				muted
				class:mirrored={facingMode === 'user'}
				class:loaded={!isLoading}
			></video>

			<!-- Camera frame overlay -->
			<div class="frame-overlay">
				<div class="frame-corner top-left"></div>
				<div class="frame-corner top-right"></div>
				<div class="frame-corner bottom-left"></div>
				<div class="frame-corner bottom-right"></div>
			</div>

			<div class="camera-ui">
				<div class="progress-indicator">
					{#each Array(4) as _dot, i (i)}
						<div class="progress-dot" class:active={i < count} class:current={i === count}>
							{#if i < count}
								<CameraIcon size={10} strokeWidth={3} />
							{:else}
								<span>{i + 1}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<button
				onclick={switchCamera}
				class="switch-camera"
				title="Switch camera"
				type="button"
				aria-label="Switch camera"
			>
				<RotateCw size={20} strokeWidth={2} />
			</button>
		</div>
	{/if}
</div>

<style>
	.camera-container {
		position: relative;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.video-wrapper {
		position: relative;
		border-radius: 1.5rem;
		overflow: hidden;
		background: var(--bg-tertiary);
		aspect-ratio: 4/3;
		box-shadow: var(--shadow-lg);
	}

	.loading-state {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: var(--bg-secondary);
		color: var(--text-secondary);
		font-size: 0.875rem;
		z-index: 5;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-color);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	video.mirrored {
		transform: scaleX(-1);
	}

	video.loaded {
		opacity: 1;
	}

	/* Frame overlay with corner accents */
	.frame-overlay {
		position: absolute;
		inset: 1.5rem;
		pointer-events: none;
		z-index: 2;
	}

	.frame-corner {
		position: absolute;
		width: 24px;
		height: 24px;
		border-color: rgba(255, 255, 255, 0.6);
		border-style: solid;
		border-width: 0;
	}

	.frame-corner.top-left {
		top: 0;
		left: 0;
		border-top-width: 3px;
		border-left-width: 3px;
		border-top-left-radius: 8px;
	}

	.frame-corner.top-right {
		top: 0;
		right: 0;
		border-top-width: 3px;
		border-right-width: 3px;
		border-top-right-radius: 8px;
	}

	.frame-corner.bottom-left {
		bottom: 0;
		left: 0;
		border-bottom-width: 3px;
		border-left-width: 3px;
		border-bottom-left-radius: 8px;
	}

	.frame-corner.bottom-right {
		bottom: 0;
		right: 0;
		border-bottom-width: 3px;
		border-right-width: 3px;
		border-bottom-right-radius: 8px;
	}

	.camera-ui {
		position: absolute;
		bottom: 1rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		z-index: 3;
	}

	.progress-indicator {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 999px;
		backdrop-filter: blur(12px);
	}

	.progress-dot {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.5);
		font-family: var(--font-mono);
		transition: all 0.3s var(--ease-out-back);
	}

	.progress-dot.active {
		background: var(--accent);
		color: white;
		transform: scale(1.1);
	}

	.progress-dot.current {
		background: rgba(255, 255, 255, 0.3);
		color: white;
		animation: pulse 1.5s ease-in-out infinite;
		box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
		}
	}

	.switch-camera {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(255, 255, 255, 0.15);
		cursor: pointer;
		backdrop-filter: blur(12px);
		transition: all 0.2s var(--ease-out-expo);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		z-index: 4;
	}

	.switch-camera:hover {
		background: rgba(0, 0, 0, 0.6);
		transform: scale(1.1) rotate(180deg);
	}

	.switch-camera:active {
		transform: scale(0.95);
	}

	/* Error state */
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 2rem;
		text-align: center;
		background: var(--bg-secondary);
		border-radius: 1.5rem;
		border: 2px dashed var(--border-color);
		min-height: 400px;
	}

	.error-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: rgba(239, 68, 68, 0.1);
		border-radius: 50%;
		color: #ef4444;
	}

	.error h3 {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.error p {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
		max-width: 280px;
	}

	.retry-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		transition: all 0.2s var(--ease-out-expo);
		margin-top: 0.5rem;
	}

	.retry-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
	}

	.retry-btn:active {
		transform: translateY(0);
	}

	@media (max-width: 640px) {
		.video-wrapper {
			border-radius: 1rem;
		}

		.frame-overlay {
			inset: 1rem;
		}

		.frame-corner {
			width: 16px;
			height: 16px;
			border-width: 0;
		}

		.frame-corner.top-left {
			border-top-width: 2px;
			border-left-width: 2px;
		}

		.frame-corner.top-right {
			border-top-width: 2px;
			border-right-width: 2px;
		}

		.frame-corner.bottom-left {
			border-bottom-width: 2px;
			border-left-width: 2px;
		}

		.frame-corner.bottom-right {
			border-bottom-width: 2px;
			border-right-width: 2px;
		}

		.progress-dot {
			width: 24px;
			height: 24px;
			font-size: 0.6rem;
		}

		.switch-camera {
			width: 40px;
			height: 40px;
		}
	}
</style>
