// both desktop modes: console errors and exceptions while the page loads and takes a few keys — the conductor (a desktop) and reduced
// motion (the browser's own scroll, the scenes at rest; `?cenas=0` is gone since the old desktop scroll went, 23 Nov)
import { open, key, sleep, state } from './h.mjs'
for (const [url, reduce] of [['http://localhost:3100/', false], ['http://localhost:3100/?reduced', true]]) {
  const p = await open('about:blank')
  if (reduce) await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  const errs = []
  p.ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description?.split('\n')[0])
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push(m.params.args.map((a) => a.value ?? a.description).join(' '))
  })
  await p.send('Page.navigate', { url })
  await sleep(2500)
  await key(p, 'Shift')
  await sleep(800)
  for (let i = 0; i < 5; i++) { await key(p, 'PageDown'); await sleep(2200) }
  const s = await state(p)
  const info = await p.ev(`return {cenas: 'cenas' in document.documentElement.dataset, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, stops: document.querySelectorAll('[data-stop]').length}`)
  console.log(url, JSON.stringify(info), 'y', s.y, 'work ch', s.ch, 'pass', s.pass, 'method', s.mp, 'errors', errs.length ? errs : 'none')
  p.ws.close()
}
process.exit(0)
