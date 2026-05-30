import { BACKEND_PGSQL_URI } from '$env/static/private';
import { generateRandomString } from '$lib';
import type { SendPasteData } from '$lib/types';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pg from 'pg';

let conn = new pg.Pool({
	connectionString: BACKEND_PGSQL_URI,
	ssl: true
});

export const POST: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	let data: SendPasteData = await event.request.json();
	let paste_id = generateRandomString(6);
	let delete_password = generateRandomString(10);

	await conn.query(`INSERT INTO pastes VALUES ($1, $2, $3, $4, $5, $6)`, [
		paste_id,
		data.content,
		data.language,
		data.author,
		new Date().toISOString(),
		delete_password
	]);
	return json({
		id: paste_id,
		delete_password
	});
};
