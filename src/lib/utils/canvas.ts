import type { Photo, LayoutType } from '$lib/types/photo';

// Generate a demo photo with colored background and text
export function generateDemoPhoto(index: number): string {
	const canvas = document.createElement('canvas');
	canvas.width = 1920;
	canvas.height = 1080;
	const ctx = canvas.getContext('2d');

	if (!ctx) throw new Error('Could not get canvas context');

	// Gradient backgrounds for each photo
	const gradients = [
		['#667eea', '#764ba2'],
		['#f093fb', '#f5576c'],
		['#4facfe', '#00f2fe'],
		['#43e97b', '#38f9d7']
	];

	const [color1, color2] = gradients[index % gradients.length];

	// Create gradient
	const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
	gradient.addColorStop(0, color1);
	gradient.addColorStop(1, color2);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Add decorative circle
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.beginPath();
	ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 300, 0, Math.PI * 2);
	ctx.fill();

	// Add photo number text
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 200px sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(`#${index + 1}`, canvas.width / 2, canvas.height / 2);

	// Add "DEMO" label
	ctx.font = 'bold 60px sans-serif';
	ctx.fillText('DEMO', canvas.width / 2, canvas.height / 2 + 150);

	return canvas.toDataURL('image/png', 0.95);
}

// Helper to load image from data URL
function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

export async function createPhotoStrip(
	photos: Photo[],
	layout: LayoutType,
	frameColor?: string,
	background?: string
): Promise<string> {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) throw new Error('Could not get canvas context');

	// High resolution for quality output (300 DPI equivalent)
	const photoWidth = 1200;
	const photoHeight = 900;
	const padding = 60;
	const headerHeight = 180;
	const footerHeight = 150;

	if (layout === 'strip-4x1') {
		// Horizontal strip
		canvas.width = photoWidth * 4 + padding * 5;
		canvas.height = photoHeight + headerHeight + footerHeight;

		// Background
		ctx.fillStyle = background || '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Frame border
		if (frameColor) {
			ctx.strokeStyle = frameColor;
			ctx.lineWidth = 30;
			ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
		}

		// Header
		ctx.fillStyle = '#1a1a1a';
		ctx.font = 'bold 72px serif';
		ctx.textAlign = 'center';
		ctx.fillText('📸 Photo Booth', canvas.width / 2, 120);

		// Photos - load all images first
		for (let i = 0; i < photos.length; i++) {
			const photo = photos[i];
			const img = await loadImage(photo.dataUrl);
			const x = padding + i * (photoWidth + padding);
			const y = headerHeight;

			ctx.drawImage(img, x, y, photoWidth, photoHeight);
		}

		// Footer with date
		ctx.fillStyle = '#666';
		ctx.font = '42px sans-serif';
		ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 60);
	} else {
		// 2x2 vertical strip (default) - optimized layout
		const gridGap = 40; // Gap between photos
		const fullPhotoWidth = (photoWidth - gridGap) / 2; // Each photo takes half width minus gap
		const fullPhotoHeight = (photoHeight - gridGap) / 2; // Each photo takes half height minus gap

		canvas.width = photoWidth + padding * 2;
		canvas.height = headerHeight + photoHeight + padding * 2 + footerHeight;

		// Background
		ctx.fillStyle = background || '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Frame border
		if (frameColor) {
			ctx.strokeStyle = frameColor;
			ctx.lineWidth = 30;
			ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
		}

		// Header
		ctx.fillStyle = '#1a1a1a';
		ctx.font = 'bold 72px serif';
		ctx.textAlign = 'center';
		ctx.fillText('📸 Photo Booth', canvas.width / 2, 120);

		// Photos in 2x2 grid - positions centered properly
		const gridStartY = headerHeight + padding / 2;
		const positions = [
			{ x: padding, y: gridStartY },
			{ x: padding + fullPhotoWidth + gridGap, y: gridStartY },
			{ x: padding, y: gridStartY + fullPhotoHeight + gridGap },
			{ x: padding + fullPhotoWidth + gridGap, y: gridStartY + fullPhotoHeight + gridGap }
		];

		// Load and draw all photos
		for (let i = 0; i < Math.min(photos.length, 4); i++) {
			const photo = photos[i];
			const img = await loadImage(photo.dataUrl);
			const pos = positions[i];

			// Draw photo at full resolution (not scaled down)
			ctx.drawImage(img, pos.x, pos.y, fullPhotoWidth, fullPhotoHeight);
		}

		// Footer
		ctx.fillStyle = '#666';
		ctx.font = '42px sans-serif';
		ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 60);
	}

	return canvas.toDataURL('image/png');
}

export function downloadImage(dataUrl: string, filename: string) {
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = filename;
	link.click();
}
