import { ipcMain } from 'electron'
import { importTracks } from './library/import'
import { db } from './db/index'
import { tracks } from './db/schema'
import { eq } from 'drizzle-orm'
import path from 'node:path'
import { app } from 'electron'
import * as fs from 'node:fs'

ipcMain.handle('tracks:import', async () => {
  const result = await importTracks()
  return result
})

ipcMain.handle('tracks:list', async () => {
  const list = db.select().from(tracks).all()
  return list
})

ipcMain.handle('tracks:remove', async (_event, id: number) => {
  const rowById = db.select().from(tracks).where(eq(tracks.id, id)).get()

  if (rowById === undefined) {
    return
  }

  db.delete(tracks).where(eq(tracks.id, id)).run()

  // for library folder path
  const dir = path.join(app.getPath('userData'), 'library')
  // with filename
  const filePath = path.join(dir, rowById.file_name)
  // then delete it
  await fs.promises.rm(filePath, { force: true })
})
