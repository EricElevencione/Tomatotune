# How to Add a New Table to Your Tomatune Database

A step-by-step guide using your project's setup: **Drizzle ORM + better-sqlite3**.

---

## Overview: The Two Files You Touch

| File                                                                                                                                  | Purpose                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [schema.ts](file:///c:/Users/dblaz/OneDrive/Desktop/Personal%20Projects/Pomodoro%20with%20Music%20app/Tomatune/src/main/db/schema.ts) | Defines the table shape for **TypeScript** (Drizzle uses this for type-safe queries) |
| [index.ts](file:///c:/Users/dblaz/OneDrive/Desktop/Personal%20Projects/Pomodoro%20with%20Music%20app/Tomatune/src/main/db/index.ts)   | Creates the **actual table** in the `.db` file with raw SQL                          |

> [!IMPORTANT]
> You need **both** files updated. `schema.ts` alone doesn't create anything in the database — it only gives TypeScript the types. `index.ts` is what actually runs the SQL to create the table.

---

## Step-by-Step

### Step 1: Define the table in `schema.ts`

This tells Drizzle what your table looks like so you get type-safe queries.

```ts
// schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// You already have "tracks" here...

// Add your new table:
export const tasks = sqliteTable('tasks', {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  tracks: text().notNull(),
  title: text().notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  added_date: integer({ mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
})
```

**What each part means:**

- `sqliteTable('tasks', {...})` — `'tasks'` is the actual table name in the `.db` file
- `integer().primaryKey({ autoIncrement: true })` — auto-incrementing ID
- `text().notNull()` — a required text column
- `integer('done', { mode: 'boolean' })` — stored as 0/1 in SQLite, but Drizzle treats it as `true`/`false` in TypeScript
- `integer({ mode: 'timestamp' })` — stored as a number, but Drizzle converts it to/from a JS `Date`
- `.$defaultFn(() => new Date())` — automatically sets the current date when inserting

### Step 2: Add `CREATE TABLE` in `index.ts`

This is the raw SQL that **actually creates** the table in your `.db` file. It runs every time the app starts, but `IF NOT EXISTS` means it only creates it once.

```ts
// index.ts — add this after the existing tracks CREATE TABLE

sqlite.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  tracks TEXT NOT NULL,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  added_date INTEGER NOT NULL
);`)
```

> [!WARNING]
> The column names and types here **must match** what you wrote in `schema.ts`. If they don't match, you'll get runtime errors when querying.

### Step 3: Restart the app

The `CREATE TABLE` statements run when the app starts (when `index.ts` is first imported). So:

1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` (or however you start it) again
3. The table is now in the `.db` file ✅

### Step 4: Use it in your code

Now you can import and query the table anywhere in `src/main/`:

```ts
import { db, tasks } from './db' // adjust path as needed
import { eq } from 'drizzle-orm'

// INSERT
db.insert(tasks).values({ title: 'Study Math', tracks: '[]' }).run()

// SELECT all
const allTasks = db.select().from(tasks).all()

// SELECT one
const task = db.select().from(tasks).where(eq(tasks.id, 1)).get()

// UPDATE
db.update(tasks).set({ done: true }).where(eq(tasks.id, 1)).run()

// DELETE
db.delete(tasks).where(eq(tasks.id, 1)).run()
```

> [!NOTE]
> You don't need to manually set `added_date` — the `$defaultFn` in your schema handles it automatically on insert.

---

## Quick Reference: Column Type Cheat Sheet

| What you want       | In `schema.ts` (Drizzle)                                                | In `index.ts` (raw SQL)                      |
| ------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| Auto-increment ID   | `integer().primaryKey({ autoIncrement: true }).notNull()`               | `INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL` |
| Required text       | `text().notNull()`                                                      | `TEXT NOT NULL`                              |
| Optional text       | `text()`                                                                | `TEXT`                                       |
| Number              | `integer().notNull()`                                                   | `INTEGER NOT NULL`                           |
| Boolean (as 0/1)    | `integer('col', { mode: 'boolean' }).notNull().default(false)`          | `INTEGER NOT NULL DEFAULT 0`                 |
| Timestamp (as Date) | `integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date())` | `INTEGER NOT NULL`                           |

---

## TL;DR Checklist

- [ ] Add the table definition to `schema.ts` with `sqliteTable()`
- [ ] Add the matching `CREATE TABLE IF NOT EXISTS` SQL to `index.ts`
- [ ] Make sure column names and types match between the two files
- [ ] Restart the app so the SQL runs
- [ ] Import `{ db, yourTable }` from `'./db'` wherever you need it
