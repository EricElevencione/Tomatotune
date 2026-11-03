import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const tracks = sqliteTable('tracks', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  title: text().notNull(),
  artist: text().notNull(),
  // seconds
  duration: integer().notNull(),
  file_name: text().notNull(),
  added_date: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})
