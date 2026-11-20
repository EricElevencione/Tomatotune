Main-side functions, in tasks/tasks.ts.

- List: return all tasks in creation order.
- Add: trim the title, reject empty strings, cap the length, insert, and return the saved row.
- Toggle: take an id, flip done, and return the updated row.
- Clear finished: delete every row where done is true.
- Drizzle with better-sqlite3 is synchronous, so finish each query with .all(), .get(), or .run().
- Result: the four functions work from a quick test.
