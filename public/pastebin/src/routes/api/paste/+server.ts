import { generateRandomString } from '$lib';
import { getAllPastes, savePaste } from '$lib/store';
import type { SendPasteData } from '$lib/types';
import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

// GET — fetch recent pastes for home page
export const GET: RequestHandler = async () => {
	return json(getAllPastes());
};

// POST — create new paste
export const POST: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const data: SendPasteData = await event.request.json();

	if (!data.content || data.content.trim() === '') {
		return error(400, { message: 'Content cannot be empty' });
	}
	if (!data.language || data.language.trim() === '') {
		return error(400, { message: 'Language is required' });
	}

	const paste_id = generateRandomString(6);
	const delete_password = generateRandomString(10);
	const author = data.author?.trim() || 'anonymous';

	savePaste({
		paste_id,
		paste_data: data.content,
		paste_language: data.language,
		created_by: author,
		created_on: new Date().toISOString(),
		delete_password
	});

	return json({ id: paste_id, password: delete_password });
};
