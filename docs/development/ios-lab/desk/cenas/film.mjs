// a film of the conductor for the owner: Chrome's own frames (CDP screencast), a caption per part, then an mp4 (ffmpeg)
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { open, stroke, rest, sleep, profile } from './h.mjs'
const OUT = process.argv[2] || 'film'
const dir = `${process.cwd()}/${OUT}-frames`
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
const p = await open('http://localhost:3100/?cenas=1', { w: 1440, h: 900 })
await sleep(1500)
// the caption: a small label over the page, top-left, for the viewer only (removed before the end)
const caption = (t) =>
  p.ev(`let c=document.getElementById('__cap'); if(!c){c=document.createElement('div');c.id='__cap';c.style.cssText='position:fixed;left:16px;bottom:16px;z-index:99999;font:600 15px/1.3 system-ui;color:#fff;background:rgba(200,30,30,.88);padding:8px 12px;border-radius:8px;pointer-events:none;max-width:60vw';document.body.append(c)} c.textContent=${JSON.stringify(t)}; return 1`)
const frames = []
let n = 0
p.ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.method !== 'Page.screencastFrame') return
  const f = `${dir}/f${String(n++).padStart(5, '0')}.jpg`
  writeFileSync(f, Buffer.from(m.params.data, 'base64'))
  frames.push([f, m.params.metadata.timestamp])
  p.send('Page.screencastFrameAck', { sessionId: m.params.sessionId })
})
await p.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 })
const burst = async (name, ms, count) => {
  for (let i = 0; i < count; i++) {
    const t0 = Date.now()
    for (const [dt, dy] of profile(name)) {
      if (Date.now() - t0 >= ms) break
      await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 720, y: 450, deltaX: 0, deltaY: dy })
      await sleep(dt)
    }
  }
}
const go = (id) => p.ev(`window.__cenas.go('${id}','jump'); return 1`)

await caption('1 · A entrada. Um gesto de cada vez (passada de trackpad, uma pausa entre cada)')
await sleep(3500)
for (let i = 0; i < 6; i++) {
  await stroke(p, 'gentle300')
  await rest(p, 300, 3500)
  await sleep(500)
}
await caption('2 · SCROLL SUPER RÁPIDO desde o topo: 1 passada a cada 0,3 s durante 10 s, sem parar')
await go('top')
await sleep(2000)
await burst('gentle300', 300, 33)
await caption('2 · … a mão parou. Onde ficou?')
await rest(p, 500, 4000)
await sleep(1500)
await caption('3 · SCROLL SUPER RÁPIDO para cima, até ao topo')
await burst('gentle300-up', 300, 33)
await rest(p, 500, 4000)
await sleep(1000)
await caption('4 · Mudar de ideias a meio: passada para baixo e logo para cima (passagem do Weddings)')
await burst('gentle300', 250, 1)
await sleep(350)
await stroke(p, 'gentle300-up')
await rest(p, 500, 4000)
await sleep(800)
await caption('5 · Menu → 02 Method, e uma passada logo a seguir (o bug #7)')
await p.ev(`document.querySelector('a[href="#method"]').click(); return 1`)
await sleep(300)
await stroke(p, 'gentle300')
await rest(p, 500, 4000)
await sleep(1200)
await caption('6 · Fim')
await sleep(800)
await p.send('Page.stopScreencast')
await sleep(300)
p.ws.close()
// the frames at their own times
const list = frames
  .map(([f, t], i) => `file '${f}'\nduration ${Math.max(0.001, ((frames[i + 1]?.[1] ?? t + 0.04) - t)).toFixed(4)}`)
  .join('\n')
writeFileSync(`${dir}/list.txt`, list + `\nfile '${frames[frames.length - 1][0]}'\n`)
execFileSync('/usr/local/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`, '-vf', 'fps=30,scale=1440:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', `${process.cwd()}/${OUT}.mp4`])
console.log('frames', frames.length, 'seconds', (frames[frames.length - 1][1] - frames[0][1]).toFixed(1), `${process.cwd()}/${OUT}.mp4`)
process.exit(0)
