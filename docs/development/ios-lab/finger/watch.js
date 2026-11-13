// watch.js (12 Nov): a watchdog inside the page for the "human" walks — POST to the lab console once per load
// (curl --data-binary @watch.js localhost:<port>/__diag/run), then read it back with watch-dump.js.
// Through the walk: errors, frames over 100 ms (count over 50), the passage's lifted photograph visible but off screen
// (the 12 Nov bug). At each rest (600 ms still, no finger): where the page is (as where.js), the bar against the section
// under the middle of the screen, the Questions/Contact coherence (as cstate.js), overflow, the entrance's film paused at
// the top; at 2 s still: leftovers of a gesture (an inline snap 'none', data-c-hold, data-jump, an armed menu with no menu).
if (window.__w) return 'already'
const W = (window.__w = { log: [], rests: [], long: 0, t0: performance.now() })
const R = document.documentElement
const q = (s) => document.querySelector(s)
const now = () => Math.round(performance.now() - W.t0)
const note = (k, v) => {
  const last = W.log[W.log.length - 1]
  if (last && last.k === k && last.v === v && Math.abs(last.y - scrollY) < 40) return
  W.log.push({ t: now(), y: Math.round(scrollY), k, v })
}
addEventListener('error', (e) => note('error', String(e.message).slice(0, 160)))
addEventListener('unhandledrejection', (e) => note('reject', String(e.reason).slice(0, 160)))
let touching = false
addEventListener('touchstart', () => (touching = true), { passive: true, capture: true })
addEventListener('touchend', () => (touching = false), { passive: true, capture: true })
addEventListener('touchcancel', () => (touching = false), { passive: true, capture: true })
const op = (s) => {
  const e = q(s)
  return e ? +getComputedStyle(e).opacity : -1
}
const where = () => {
  const s = R.dataset.section, y = Math.round(scrollY)
  const m = q('.method'), a = q('.about'), w = q('.work')
  if (R.scrollHeight - innerHeight - scrollY < 60) return 'fim'
  if (s === 'contact') return 'C'
  if (s === 'questions') return 'Q'
  if (a && a.dataset.phase && a.dataset.phase !== 'pre' && s === 'about') return a.dataset.phase
  if (m && m.dataset.phase && m.dataset.phase !== 'pre') return m.dataset.phase
  if (s === 'work') return 'W' + (w ? w.dataset.ch : '?')
  return (s || 'topo') + '@' + y
}
const restCheck = () => {
  const tag = where()
  W.rests.push(tag + '@' + Math.round(scrollY))
  const sec = R.dataset.section || ''
  // the section under the middle of the screen (the held entrance and the stages overlap: only flagged when no section is there)
  const mid = innerHeight / 2
  const under = ['work', 'method', 'about', 'questions', 'contact'].filter((id) => {
    const b = q('#' + id)?.getBoundingClientRect()
    return b && b.top <= mid && b.bottom >= mid
  })
  if (sec && sec !== 'top' && under.length && !under.includes(sec)) note('section', `${sec} set, under the middle: ${under.join('/')}`)
  if (R.scrollWidth > R.clientWidth + 1) note('overflow', R.scrollWidth - R.clientWidth + 'px')
  const dusk = R.classList.contains('c-dusk')
  if (sec === 'questions') {
    if (dusk) note('questions', 'dusk on')
    if (op('.c-room') > 0.05) note('questions', 'room ' + op('.c-room').toFixed(2))
  }
  const v = q('#top video')
  if (scrollY < 5 && v && !R.dataset.entrance && v.paused && !matchMedia('(prefers-reduced-motion: reduce)').matches && v.readyState > 1)
    note('film', 'paused at the top')
}
// the Contact once its passage has played (it runs ~3.3 s from the Questions; resting in it early is its dusk, not a fault)
const contactCheck = () => {
  if (!R.classList.contains('c-dusk')) note('contact', 'no dusk')
  if (op('.c-room') < 0.95) note('contact', 'room ' + op('.c-room').toFixed(2))
  if (op('.c-ask') < 0.95) note('contact', 'ask ' + op('.c-ask').toFixed(2))
}
const lateCheck = () => {
  // the bar waits for a scene to be seen (bar-client seen()): judged at 2 s, not at the stop. At the top its island is hidden
  const sec = R.dataset.section || ''
  const label = (q('.bar-sec')?.textContent || '').trim()
  if (sec && sec !== 'top' && label && label.toLowerCase() !== sec) note('bar', `section ${sec}, bar "${label}"`)
  if (R.style.scrollSnapType === 'none') note('leftover', 'inline scroll-snap-type none')
  if ('cHold' in R.dataset) note('leftover', 'data-c-hold')
  if ('jump' in R.dataset) note('leftover', 'data-jump')
  const menu = q('dialog.menu')
  if (R.dataset.menu && R.dataset.menu !== 'closed' && menu && !menu.open) note('leftover', 'data-menu=' + R.dataset.menu + ' with the menu shut')
  if (menu?.open && R.dataset.menu !== 'open') note('menu', 'open, data-menu=' + R.dataset.menu)
}
let lastY = scrollY, lastT = performance.now(), still = 0, done1 = false, done2 = false, doneC = false
const tick = (t) => {
  const dt = t - lastT
  lastT = t
  if (!document.hidden) {
    if (dt > 50) W.long++
    if (dt > 100) note('frame', Math.round(dt) + 'ms')
  }
  if (Math.abs(scrollY - lastY) < 0.5 && !touching) still += dt
  else {
    still = 0
    done1 = done2 = doneC = false
  }
  lastY = scrollY
  // the lifted photograph of the passage: visible means on screen
  for (const box of document.querySelectorAll('#top .e-window > div[aria-hidden="true"]')) {
    if (box.style.zIndex !== '3') continue
    if (+getComputedStyle(box).opacity < 0.05) continue
    const b = box.getBoundingClientRect()
    if (b.bottom < 0 || b.top > innerHeight || b.right < 0 || b.left > innerWidth) note('photo', `visible off screen at ${Math.round(b.left)},${Math.round(b.top)}`)
  }
  if (still > 600 && !done1) {
    done1 = true
    restCheck()
  }
  if (still > 2000 && !done2) {
    done2 = true
    lateCheck()
  }
  if (still > 600 && !doneC && R.dataset.section === 'contact' && !('cRun' in R.dataset)) {
    doneC = true
    contactCheck()
  }
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
return 'watching'
