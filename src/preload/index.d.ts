import { ElectronAPI } from '@electron-toolkit/preload'
import type { tracks } from '../main/db/schema'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      importTracks: () => Promise<void>
      removeTrack: (id: number) => Promise<void>
      getTracks: () => Promise<(typeof tracks.$inferSelect)[]>
    }
  }
}
