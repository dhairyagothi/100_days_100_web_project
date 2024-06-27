import axios from 'axios';
import type { SendPasteData } from './types';

export async function newPaste(data: SendPasteData): Promise<{ id: string; password: string }> {
	let res = await axios.post(`/api/paste`, data);
	return JSON.parse(res.data);
}
