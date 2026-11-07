// V5 on-device diagnostic (1 Nov 2026), from ios-1013/proxy.mjs. Serves the production build with hud.js added; the build is not touched.
//   node proxy.mjs [listen=3130] [upstream=3100]
// POST /__diag/log saves a tape, POST /__diag/file saves a photo or video from the phone, both in out/.
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync, createWriteStream, mkdirSync } from 'node:fs'
const [, , PORT = '3130', UP = '3100'] = process.argv
// paths relative to this file, so it runs on the PC (D:\STUDIO-v5) and on the Mac alike; uploads and tapes land in out/ (git-ignored)
const HERE = fileURLToPath(new URL('.', import.meta.url)).replace(/[\/]$/, ''), OUT = `${HERE}/out`
mkdirSync(OUT, { recursive: true })
const TAG = '<script src="/__diag/hud.js"></script>'
// keeps the screen on (Screen Wake Lock) on the test pages, and on the site only when its address carries ?wake (the Xiaomi's runs)
const WAKE = `<script>(function(){var l=null,ask=function(){if(!navigator.wakeLock||document.visibilityState!=='visible')return;navigator.wakeLock.request('screen').then(function(x){l=x;document.title='☀ '+document.title.replace(/^☀ /,'')}).catch(function(){})};document.addEventListener('visibilitychange',ask);ask()})()</script>`
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
// 7 Nov (Mac): a remote console for the Simulator, which has no finger to press the HUD's buttons. The page (hud.js) long-polls
// GET /__diag/cmd for JavaScript; `curl --data-binary 'js' localhost:3130/__diag/run` queues it and answers with what it returned.
const queue = [], waiting = new Map(); let polls = [], seq = 0
const send = () => { while (queue.length && polls.length) { const p = polls.shift(); p.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); p.end(JSON.stringify(queue.shift())) } }
const body = (req) => new Promise((ok) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => ok(Buffer.concat(c).toString('utf8'))) })
http.createServer(async (req, res) => {
  if (req.url.startsWith('/__diag/cmd')) {
    polls.push(res); const t = setTimeout(() => { polls = polls.filter((p) => p !== res); res.writeHead(204); res.end() }, 20000)
    res.on('close', () => { clearTimeout(t); polls = polls.filter((p) => p !== res) }); return send()
  }
  if (req.url.startsWith('/__diag/res') && req.method === 'POST') {
    const id = +new URL(req.url, 'http://x').searchParams.get('id'), r = await body(req), w = waiting.get(id)
    if (w) { waiting.delete(id); w.writeHead(200, { 'content-type': 'application/json' }); w.end(r + '\n') }
    res.writeHead(204); return res.end()
  }
  if (req.url.startsWith('/__diag/run') && req.method === 'POST') {
    const id = ++seq; waiting.set(id, res); queue.push({ id, js: await body(req) }); send()
    setTimeout(() => { if (waiting.delete(id)) { res.writeHead(504); res.end('no page answered in 150 s\n') } }, 150000); return
  }
  if (req.url.startsWith('/__diag/hud.js')) { res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' }); return res.end(readFileSync(`${HERE}/hud.js`)) }
  // the test pages (/__diag/lab*) keep the screen on while open and visible (Screen Wake Lock; needs a secure context, so it works on
  // the Xiaomi through adb reverse on localhost, not on the iPhone through the LAN address). Only these pages; the site is untouched.
  const lab = req.url.match(/^\/__diag\/(lab\d*)/)
  if (lab && !req.url.startsWith('/__diag/log')) {
    const html = readFileSync(`${HERE}/labs/${lab[1]}.html`, 'utf8').replace('</body>', WAKE + '</body>')
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); return res.end(html)
  }
  if (req.url.startsWith('/__diag/log') && req.method === 'POST') {
    const chunks = []; req.on('data', (c) => chunks.push(c)); req.on('end', () => {
      const body = Buffer.concat(chunks), file = `${stamp()}-tape.json`; writeFileSync(`${OUT}/${file}`, body); console.log('saved', file, body.length)
      res.writeHead(200, { 'content-type': 'text/plain' }); res.end(file) })
    return
  }
  if (req.url.startsWith('/__diag/file') && req.method === 'POST') {
    const name = (new URL(req.url, 'http://x').searchParams.get('name') || 'file').replace(/[^\w.-]/g, '_'), file = `${stamp()}-${name}`
    const w = createWriteStream(`${OUT}/${file}`); req.pipe(w); w.on('finish', () => { console.log('saved', file, w.bytesWritten); res.writeHead(200, { 'content-type': 'text/plain' }); res.end(file) })
    return
  }
  const headers = { ...req.headers, host: `127.0.0.1:${UP}`, 'accept-encoding': 'identity' }
  const up = http.request({ host: '127.0.0.1', port: +UP, path: req.url, method: req.method, headers }, (r) => {
    if (!(r.headers['content-type'] || '').includes('text/html')) { res.writeHead(r.statusCode, r.headers); return r.pipe(res) }
    const chunks = []; r.on('data', (c) => chunks.push(c)); r.on('end', () => {
      const html = Buffer.concat(chunks).toString('utf8'), tag = TAG + (/[?&]wake/.test(req.url) ? WAKE : ''), body = html.includes('</body>') ? html.replace('</body>', tag + '</body>') : html + tag
      const h = { ...r.headers, 'cache-control': 'no-store' }; delete h['content-length']; delete h.etag; delete h['transfer-encoding']
      res.writeHead(r.statusCode, h); res.end(body) })
  })
  up.on('error', (e) => { res.writeHead(502); res.end('upstream ' + e.message) })
  req.pipe(up)
}).listen(+PORT, '0.0.0.0', () => console.log(`proxy http://0.0.0.0:${PORT} -> 127.0.0.1:${UP}`))
