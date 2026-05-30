import { BACKEND_PGSQL_URI } from '$env/static/private';
import type { PasteResponseData } from '$lib/types';
import { error, json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pg from 'pg';

const pool = new pg.Pool({
	connectionString: BACKEND_PGSQL_URI,
	ssl: true
});

export const GET: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const res = await pool.query<PasteResponseData>(
		`SELECT * FROM pastes WHERE paste_id = $1`,
		[event.params.id]
	);

	if (!res.rowCount || res.rowCount === 0) {
		return error(404, { message: 'Paste not found' });
	}

	return json(res.rows[0]);
};

export const DELETE: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const body = await event.request.json();
	const { delete_password } = body;

	if (!delete_password) {
		return error(400, { message: 'delete_password is required' });
	}

	// Fetch paste first to verify password
	const res = await pool.query<PasteResponseData>(
		`SELECT delete_password FROM pastes WHERE paste_id = $1`,
		[event.params.id]
	);

	if (!res.rowCount || res.rowCount === 0) {
		return error(404, { message: 'Paste not found' });
	}

	const paste = res.rows[0];
	if (paste.delete_password !== delete_password) {
		return error(403, { message: 'Invalid delete password' });
	}

	await pool.query(`DELETE FROM pastes WHERE paste_id = $1`, [event.params.id]);

	return json({ success: true, message: 'Paste deleted successfully' });
};
