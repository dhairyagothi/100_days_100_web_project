import pkg from 'pg'
const { Pool } = pkg

import { config } from './index.js'

const pool = new Pool({
  connectionString: config.databaseUrl,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export const query = (text, params) => pool.query(text, params)

export const getPool = () => pool

export default pool
