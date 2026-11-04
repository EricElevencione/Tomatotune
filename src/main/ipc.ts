import { ipcMain } from 'electron'
import { importTracks } from './library/import'
import { db } from './db/index'
import { tracks } from './db/schema'

ipcMain.handle('tracks:import', async () => {
  const result = await importTracks()
  db.select().from(tracks).all()
  return result
})
