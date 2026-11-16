// The flight recorder's collector (src/lib/rec.ts): the page, in Chrome or Safari with ?rec, sends its log here every 0.5 s; each session is
// written to ~/.local/share/v5-lab/rec/live/<session>.ndjson as it comes, so a page that dies loses at most its last half second (and the
// next page sends what the dead one kept in localStorage). No dependencies.
//   ~/.local/share/node22/bin/node docs/development/ios-lab/desk/cenas/collector.mjs        (listens on 127.0.0.1:3199)
//   GET http://localhost:3199/ → the sessions received
import { createServer } from 'node:http'
import { appendFileSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
const DIR = `${process.env.HOME}/.local/share/v5-lab/rec/live`
mkdirSync(DIR, { recursive: true })
const seen = new Map() // session → chunks received (a chunk sent twice — once alive, once again by the next page — is written once)
createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  if (req.method === 'OPTIONS') return res.end()
  // test pages for the browsers (pages/), e.g. /t/waapi.html
  if (req.method === 'GET' && req.url.startsWith('/t/')) {
    const name = req.url.slice(3).replace(/[^\w.-]/g, '')
    try {
      res.setHeader('content-type', 'text/html; charset=utf-8')
      return res.end(readFileSync(new URL(`./pages/${name}`, import.meta.url)))
    } catch {
      return res.writeHead(404).end()
    }
  }
  if (req.method === 'GET') {
    const files = readdirSync(DIR)
      .filter((f) => f.endsWith('.ndjson'))
      .map((f) => `${f}  ${statSync(`${DIR}/${f}`).size} bytes`)
    return res.end(files.join('\n') + '\n')
  }
  let body = ''
  req.on('data', (d) => (body += d))
  req.on('end', () => {
    const nl = body.indexOf('\n')
    const [session, n] = body.slice(0, nl).split(' ')
    if (!/^[\w-]+$/.test(session ?? '')) return res.writeHead(400).end()
    const got = seen.get(session) ?? new Set()
    if (!got.has(n)) {
      got.add(n)
      seen.set(session, got)
      appendFileSync(`${DIR}/${session}.ndjson`, body.slice(nl + 1) + '\n')
    }
    res.end('ok')
  })
}).listen(3199, '127.0.0.1', () => console.log(`collector on http://localhost:3199 → ${DIR}`))
