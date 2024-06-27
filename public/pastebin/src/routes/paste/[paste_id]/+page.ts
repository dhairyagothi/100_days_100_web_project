import { error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load(event) {
	let res = await event.fetch(`/api/paste/${event.params.paste_id}`);
	if (res.status == 200) {
		return await res.json();
	} else {
		return error(404, {
			message: `Paste ${event.params.paste_id} does not exist.`
		});
	}
}
