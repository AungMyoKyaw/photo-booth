<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { RotateCw, AlertCircle } from 'lucide-svelte';

	interface Props {
		count?: number;
		exposeCapture?: (fn: () => Promise<string | null>) => void;
	}

	let { count = 0, exposeCapture }: Props = $props();

	let videoElement = $state<HTMLVideoElement | undefined>();
	let error = $state<string | null>(null);
	let facingMode = $state<'user' | 'environment'>('user');
	let stream: MediaStream | null = null;

	async function startCamera() {
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
				<AlertCircle size={48} strokeWidth={2} />
			</div>
			<p>{error}</p>
			<button onclick={startCamera} class="retry-btn" type="button">Try Again</button>
		</div>
	{:else}
		<div class="video-wrapper">
			<video
				bind:this={videoElement}
				autoplay
				playsinline
				muted
				class:mirrored={facingMode === 'user'}
			></video>

			<div class="camera-ui">
				<div class="progress-dots">
					{#each Array(4) as _, i (i)}
						<!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
						<div class="dot" class:active={i < count} class:current={i === count}></div>
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
		border-radius: 1rem;
		overflow: hidden;
		background: #000;
		aspect-ratio: 4/3;
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	video.mirrored {
		transform: scaleX(-1);
	}

	.camera-ui {
		position: absolute;
		bottom: 1rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.progress-dots {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 999px;
		backdrop-filter: blur(8px);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transition: all 0.3s ease;
	}

	.dot.active {
		background: #fff;
		transform: scale(1.1);
	}

	.dot.current {
		background: #f43f5e;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.switch-camera {
		position: absolute;
		top: 1rem;
		right: 1rem;
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

	.switch-camera:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 3rem;
		text-align: center;
		color: #f43f5e;
	}

	.error-icon {
		width: 48px;
		height: 48px;
		margin-bottom: 0.5rem;
		color: #f43f5e;
	}

	.retry-btn {
		padding: 0.75rem 1.5rem;
		background: #1a1a1a;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.retry-btn:hover {
		opacity: 0.9;
	}
</style>
