import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
	const res = await event.fetch(`/api/paste/${event.params.paste_id}`);

	if (res.status === 200) {
		return await res.json();
	}

	// Must be throw, not return — SvelteKit requires throw for error()
	throw error(404, {
		message: `Paste "${event.params.paste_id}" does not exist.`
	});
};
