import { db } from '../db/index'
import { tasks } from '../db/schema'
import { asc } from 'drizzle-orm'

export function listTasks() {
  return db.select().from(tasks).orderBy(asc(tasks.added_date), asc(tasks.id)).all()
}
export function addTasks(title: string, maxLength: number) {
  const trimmedTitle = title.trim()
  const titleLimit = trimmedTitle.slice(0, maxLength)

  if (trimmedTitle === '') {
    throw new Error('Task title is required')
  }

  return db.insert(tasks).values({ title: titleLimit }).returning().get()
}
