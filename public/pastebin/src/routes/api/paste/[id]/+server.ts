import { getPaste, removePaste } from '$lib/store';
import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

// GET — fetch a single paste by ID
export const GET: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const paste = getPaste(event.params.id ?? '');

	if (!paste) {
		return error(404, { message: 'Paste not found' });
	}

	return json(paste);
};

// DELETE — delete a paste using its password
export const DELETE: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const body = await event.request.json();
	const { delete_password } = body;

	if (!delete_password) {
		return error(400, { message: 'delete_password is required' });
	}

	const paste = getPaste(event.params.id ?? '');

	if (!paste) {
		return error(404, { message: 'Paste not found' });
	}

	if (paste.delete_password !== delete_password) {
		return error(403, { message: 'Invalid delete password' });
	}

	removePaste(event.params.id ?? '');

	return json({ success: true, message: 'Paste deleted successfully' });
};
