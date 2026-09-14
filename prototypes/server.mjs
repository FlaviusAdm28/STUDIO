/**
 * Prototype static server.
 *
 * Serves one prototype directory, and aliases /media -> <repo>/public/media so the
 * prototypes use the real Venice plate without duplicating a 2 MB binary.
 *
 *   node prototypes/server.mjs promotion 3001
 *   node prototypes/server.mjs the-index 3002
 *
 * Nothing here is part of the Next build. These are throwaway review harnesses.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '..')

const dir = process.argv[2]
const port = Number(process.argv[3])

if (!dir || !port) {
  console.error('usage: node prototypes/server.mjs <dir> <port>')
  process.exit(1)
}

const root = path.join(here, dir)
const media = path.join(repo, 'public', 'media')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.svg': 'image/svg+xml',
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])

  let file
  if (url.startsWith('/media/')) {
    // Alias onto the real project assets.
    const rel = path.normalize(url.slice('/media/'.length)).replace(/^(\.\.[/\\])+/, '')
    file = path.join(media, rel)
  } else {
    const rel = path.normalize(url === '/' ? 'index.html' : url.slice(1)).replace(/^(\.\.[/\\])+/, '')
    file = path.join(root, rel)
  }

  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('not found: ' + url)
      return
    }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
    })
    res.end(buf)
  })
})

server.listen(port, () => {
  console.log(`[${dir}] http://localhost:${port}`)
})
