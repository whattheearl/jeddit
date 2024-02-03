import { mysqlTable, varchar, serial } from "drizzle-orm/mysql-core";

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 40 }).unique(),
  email: varchar('email', { length: 256 }).unique(),
  sub: varchar('sub', { length: 256 }).unique(),
  authority: varchar('authority', { length: 256 }),
  clientId: varchar('clientId', { length: 256 }),
});