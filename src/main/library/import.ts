import { dialog } from 'electron'
import path from 'node:path'
import { app } from 'electron'
import * as fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { parseFile } from 'music-metadata'
import { db } from '../../main/db/index'
import { tracks } from '../db/schema'

export async function importTracks() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'flac', 'wav', 'm4a', 'ogg', 'mp4'] }]
  })

  // If user closed/cancelled the picker without choosing
  if (result.canceled || result.filePaths.length === 0) {
    return
  }

  const dir = path.join(app.getPath('userData'), 'library')

  await fs.promises.mkdir(dir, { recursive: true })

  for (const sourcePath of result.filePaths) {
    const ext = path.parse(sourcePath).name
    // unique name
    const fileName = `${randomUUID()}${ext}`
    // destination of the file
    const destination = path.join(dir, fileName)

    await fs.promises.copyFile(sourcePath, destination)

    const metadata = await parseFile(destination)

    const title = metadata.common.title || path.parse(sourcePath).name // string, or undefined
    const artist = metadata.common.artist || 'Unknown Artist' // string, or undefined
    const duration = Math.ceil(metadata.format.duration ?? 0) // number of seconds, or undefined

    db.insert(tracks)
      .values({
        title: title,
        artist: artist,
        duration: duration,
        file_name: fileName
      })
      .run()
  }
}
