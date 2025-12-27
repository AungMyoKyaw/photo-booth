export type FilterType =
	| 'none'
	| 'grayscale'
	| 'sepia'
	| 'vintage'
	| 'cold'
	| 'warm'
	| 'dramatic'
	| 'blur'
	| 'brightness'
	| 'contrast';

export type LayoutType = 'strip-2x2' | 'strip-4x1';

export interface Photo {
	id: string;
	dataUrl: string;
	timestamp: number;
	filter: FilterType;
	stickers: { emoji: string; x: number; y: number; size: number }[];
	text?: { content: string; x: number; y: number; size: number; color: string };
}

export interface PhotoStrip {
	id: string;
	photos: Photo[];
	layout: LayoutType;
	frame?: string;
	background?: string;
}
