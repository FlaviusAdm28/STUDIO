// without the conductor (?cenas=0): the Contact still reads the scroll — the light down on the way to its stop, up on the way back
import { open, sleep } from './h.mjs'
const [w, h] = (process.argv[2] || '1440x900').split('x').map(Number)
const p = await open('http://localhost:3100/?cenas=0', { w, h })
await sleep(2500)
const r = await p.ev(`
  const R = document.documentElement, start = document.querySelector('#contact .c-start'), q = document.getElementById('questions');
  const frame = () => new Promise(r => requestAnimationFrame(r));
  const glide = async (to) => { const from = scrollY; for (let i = 1; i <= 40; i++) { scrollTo({ top: from + (to - from) * i / 40, behavior: 'instant' }); await frame() } };
  const qY = Math.round(q.getBoundingClientRect().top + scrollY), cY = Math.round(start.getBoundingClientRect().top + scrollY);
  R.style.scrollSnapType = 'none';
  scrollTo({ top: qY, behavior: 'instant' }); await new Promise(r => setTimeout(r, 2500));
  const atQ = [R.classList.contains('c-dusk'), 'cRun' in R.dataset];
  await glide(cY); await new Promise(r => setTimeout(r, 3800));
  const atC = [R.classList.contains('c-dusk'), 'cRun' in R.dataset, getComputedStyle(document.querySelector('#contact .c-ask')).opacity];
  await glide(qY); await new Promise(r => setTimeout(r, 2500));
  const back = [R.classList.contains('c-dusk'), 'cRun' in R.dataset, getComputedStyle(q.querySelector('.q-box')).opacity];
  return JSON.stringify({ qY, cY, atQ, atC, back, cenas: 'cenas' in R.dataset })`)
console.log(w + 'x' + h, r)
p.ws.close(); process.exit(0)
