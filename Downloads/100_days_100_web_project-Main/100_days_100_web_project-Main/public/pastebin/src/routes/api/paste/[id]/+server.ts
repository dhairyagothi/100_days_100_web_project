import { BACKEND_PGSQL_URI } from '$env/static/private';
import type { PasteResponseData } from '$lib/types';
import { error, json, redirect, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import pg from 'pg';

let pool = new pg.Pool({
	connectionString: BACKEND_PGSQL_URI,
	ssl: true
});

export const GET: RequestHandler = async (
	event: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	let res = await pool.query<PasteResponseData>(`SELECT * FROM pastes WHERE paste_id=$1`, [
		event.params.id
	]);
	if (res.rowCount) {
		return json(res.rows.at(0) || ``);
	}
	return error(404);
};
