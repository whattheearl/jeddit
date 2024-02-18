import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		database: 'jeddit',
		host: 'localhost',
		port: 3306,
		user: 'user',
		password: 'password'
	}
} satisfies Config;
