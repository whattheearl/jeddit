import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// handle reading env var outside of sveltekit
async function getEnv() {
  if (process?.env?.IS_DB_MIGRATION) {
    const { env } = await import('$env/dynamic/private');
    return env;
  } else {
    await import('dotenv/config');
    return process.env;
  }
}

async function getConfig() {
  const env = await getEnv();
  return {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true,
  }
}

const config = await getConfig();
export const connection = await mysql.createConnection(config);
export const db = drizzle(connection, { schema: schema, mode: 'default' });