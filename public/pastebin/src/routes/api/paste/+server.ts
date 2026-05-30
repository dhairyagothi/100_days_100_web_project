import { BACKEND_PGSQL_URI } from '$env/static/private';
import { generateRandomString } from '$lib';
import type { SendPasteData } from '$lib/types';
import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pg from 'pg';

const conn = new pg.Pool({
	connectionString: BACKEND_PGSQL_URI,
	ssl: true
});

// GET — fetch recent pastes for home page
export const GET: RequestHandler = async () => {
	const res = await conn.query(
		`SELECT paste_id, paste_language, created_by, created_on
		 FROM pastes
		 ORDER BY created_on DESC
		 LIMIT 10`
	);
	return json(res.rows);
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

	await conn.query(
		`INSERT INTO pastes (paste_id, paste_data, paste_language, created_by, created_on, delete_password)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		[paste_id, data.content, data.language, author, new Date().toISOString(), delete_password]
	);

	return json({ id: paste_id, password: delete_password });
};
