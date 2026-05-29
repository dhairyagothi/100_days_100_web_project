import axios, { AxiosError } from 'axios';
import type { SendPasteData } from './types';

export async function newPaste(data: SendPasteData): Promise<{ id: string; password: string }> {
	const res = await axios.post(`/api/paste`, data);
	// axios already parses JSON; no need for JSON.parse
	return res.data;
}

export async function deletePaste(id: string, password: string): Promise<boolean> {
	try {
		const res = await axios.delete(`/api/paste/${id}`, {
			data: { delete_password: password }
		});
		return res.status === 200;
	} catch (e) {
		if (e instanceof AxiosError && e.response?.status === 403) {
			return false;
		}
		throw e;
	}
}
