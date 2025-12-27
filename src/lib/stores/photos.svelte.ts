import type { Photo, PhotoStrip } from '$lib/types/photo';

class PhotoStore {
	photos = $state<Photo[]>([]);
	photoStrips = $state<PhotoStrip[]>([]);
	currentLayout = $state<'strip-2x2' | 'strip-4x1'>('strip-2x2');
	selectedFrame = $state<string | undefined>(undefined);
	selectedBackground = $state<string>('#ffffff');
	captureCount = $state(0);
	maxPhotos = 4;

	addPhoto(photo: Photo) {
		this.photos.push(photo);
		this.captureCount = this.photos.length;
	}

	removePhoto(id: string) {
		const index = this.photos.findIndex((p) => p.id === id);
		if (index !== -1) {
			this.photos.splice(index, 1);
			this.captureCount = this.photos.length;
		}
	}

	clearPhotos() {
		this.photos = [];
		this.captureCount = 0;
	}

	setLayout(layout: 'strip-2x2' | 'strip-4x1') {
		this.currentLayout = layout;
	}

	setFrame(frame: string | undefined) {
		this.selectedFrame = frame;
	}

	setBackground(color: string) {
		this.selectedBackground = color;
	}

	createPhotoStrip(): PhotoStrip {
		const strip: PhotoStrip = {
			id: crypto.randomUUID(),
			photos: [...this.photos],
			layout: this.currentLayout,
			frame: this.selectedFrame,
			background: this.selectedBackground
		};
		this.photoStrips.push(strip);
		return strip;
	}

	removePhotoStrip(id: string) {
		const index = this.photoStrips.findIndex((s) => s.id === id);
		if (index !== -1) {
			this.photoStrips.splice(index, 1);
		}
	}

	get canCapture() {
		return this.captureCount < this.maxPhotos;
	}

	get progress() {
		return (this.captureCount / this.maxPhotos) * 100;
	}

	reset() {
		this.clearPhotos();
		this.selectedFrame = undefined;
		this.selectedBackground = '#ffffff';
	}
}

export const photoStore = new PhotoStore();
