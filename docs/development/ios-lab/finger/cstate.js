// cstate.js: the Questions/Contact state at rest, checked for coherence (✗ lists what is wrong) — POST to the lab console
const q = (s) => document.querySelector(s), R = document.documentElement, d = R.dataset, y = Math.round(scrollY)
const op = (s) => { const e = q(s); return e ? +getComputedStyle(e).opacity : -1 }
// within the 40–56 px a browser bar adds or takes at the end (11 Nov)
const end = R.scrollHeight - innerHeight - scrollY < 60
const sec = d.section, label = (q('.bar-sec')?.textContent || '').trim(), dusk = R.classList.contains('c-dusk')
const bad = []
let tag
if (sec === 'about') tag = 'A' + (q('.about').dataset.phase || '')
else if (sec === 'questions') {
  tag = 'Q'
  if (dusk) bad.push('dusk')
  if (op('.c-room') > 0.05) bad.push('sala' + op('.c-room').toFixed(2))
  if (op('.questions .q-box') < 0.95) bad.push('perguntas' + op('.questions .q-box').toFixed(2))
  if (!/questions/i.test(label)) bad.push('barra:' + label)
} else if (sec === 'contact') {
  tag = end ? 'C·fim' : 'C'
  if (!dusk) bad.push('semDusk')
  if (op('.c-room') < 0.95) bad.push('sala' + op('.c-room').toFixed(2))
  if (op('.c-ask') < 0.95) bad.push('pergunta' + op('.c-ask').toFixed(2))
  if (op('.c-now') < 0.95) bad.push('linha' + op('.c-now').toFixed(2))
  if (end && op('.colophon') < 0.95) bad.push('colofao' + op('.colophon').toFixed(2))
  if (!/contact/i.test(label)) bad.push('barra:' + label)
} else tag = (sec || '?')
if (R.scrollWidth > R.clientWidth) bad.push('overflow')
return tag + y + (bad.length ? '✗(' + bad.join(',') + ')' : '')
