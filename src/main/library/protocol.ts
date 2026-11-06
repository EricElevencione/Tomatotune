import { app, net, protocol } from 'electron'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

export function registerTomatuneScheme() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'tomatune',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        corsEnabled: true
      }
    }
  ])
}

export function registerTomatuneProtocolHandler() {
  app.whenReady().then(() => {
    // Create your application window here
    protocol.handle('tomatune', async (request) => {
      const url = new URL(request.url)

      const pathname = url.pathname

      let fileName: string

      try {
        fileName = decodeURIComponent(pathname.slice(1))
      } catch (error) {
        return new Response('Invalid filename', { status: 400 })
      }

      if (
        fileName === '' ||
        path.basename(fileName) !== fileName ||
        fileName === '.' ||
        fileName === '..'
      ) {
        return new Response('Invalid filename', { status: 400 })
      }

      const libraryPath = path.join(app.getPath('userData'), 'library')
      const filePath = path.join(libraryPath, fileName)

      try {
        return await net.fetch(pathToFileURL(filePath).toString(), {
          headers: request.headers
        })
      } catch (error) {
        return new Response('Not found', { status: 404 })
      }
    })
  })
}
