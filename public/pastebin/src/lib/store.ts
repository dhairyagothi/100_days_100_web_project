import type { PasteResponseData } from './types';

/**
 * In-memory paste store — no database required.
 * Data persists while the server is running; resets on restart.
 */
const pastes = new Map<string, PasteResponseData>();

export function getAllPastes(): PasteResponseData[] {
	return Array.from(pastes.values())
		.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
		.slice(0, 10);
}

export function getPaste(id: string): PasteResponseData | undefined {
	return pastes.get(id);
}

export function savePaste(paste: PasteResponseData): void {
	pastes.set(paste.paste_id, paste);
}

export function removePaste(id: string): boolean {
	return pastes.delete(id);
}
