'use client'

import { useEffect } from 'react'
import { contact, method, nav } from '@content'
import { runStage } from './method-stage'

/*
  What the Method does once the page is live (README #30, #36, #45, #49): it composes the six screens, the cover and the
  closing line from the visitor's own arrival (kept by the entrance script on window.__c1: the time, the hour's light,
  whether they came back) and from the name written in Make it yours — only in this open page, never sent or stored. The
  name first shows the same on every template (that is still a template), then shapes each screen, the cover, "For Ana.",
  "Talk to us, Ana" and "Hello, Ana." in the menu. It marks the screen of the chapter chosen at the entrance (Weddings by
  default). It returns nothing: the markup is the server's.
*/
type Arrival = { time: number; hhmm: string; light: string; returning: boolean }
type C1 = { arrival?: Arrival; chapter?: string | null; name?: string }

const ONES = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
const ORDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth']
const num = (n: number) => (n <= 20 ? ONES[n] : n < 30 ? `twenty-${ONES[n - 20]}` : n === 30 ? 'thirty' : '')
const ordinalWords = (n: number) => (n <= 20 ? ORDS[n - 1] : n < 30 ? `twenty-${ORDS[n - 21]}` : n === 30 ? 'thirtieth' : 'thirty-first')
/** "fourteen past nine", "a quarter to ten", "half past two", "nine o'clock" */
function timeInWords(h: number, m: number) {
  const cur = h % 12 || 12
  const next = (h + 1) % 12 || 12
  if (m === 0) return `${ONES[cur]} o'clock`
  if (m === 15) return `a quarter past ${ONES[cur]}`
  if (m === 30) return `half past ${ONES[cur]}`
  if (m === 45) return `a quarter to ${ONES[next]}`
  if (m < 30) return `${m <= 20 ? ONES[m] : num(m)} past ${ONES[cur]}`
  const left = 60 - m
  return `${left <= 20 ? ONES[left] : num(left)} to ${ONES[next]}`
}

export function MethodClient() {
  useEffect(() => {
    const section = document.getElementById('method')
    if (!section) return
    const w = window as Window & { __c1?: C1 }
    const c1 = (w.__c1 ??= {})
    const now = c1.arrival ? new Date(c1.arrival.time) : new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' })
    const month = now.toLocaleDateString('en-GB', { month: 'long' })
    const day = now.getDate()
    const words = timeInWords(now.getHours(), now.getMinutes())
    const fillIn = (t: string, name = '') =>
      t
        .replace('{weekday}', weekday)
        .replace('{day}', String(day))
        .replace('{month}', month)
        .replace('{mon}', month.slice(0, 3))
        .replace('{ordinal}', ordinalWords(day))
        .replace('{time}', hhmm)
        .replace('{timeInWords}', words)
        .replace('{year}', String(now.getFullYear()))
        .replace('{name}', name)
    const slots = (slot: string) => section.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`)
    const fill = (slot: string, text: string) => slots(slot).forEach((el) => (el.textContent = text))
    const show = (slot: string, on: boolean) => slots(slot).forEach((el) => (el.hidden = !on))
    const s = method.screens

    // the screens that do not change with the name
    fill('wedding-line', fillIn(s.wedding.line))
    fill('rsvp-line', fillIn(s.rsvp.line))
    fill('event-kicker', fillIn(s.event.kicker))
    section.querySelectorAll<HTMLElement>('[data-slot="guide-time"]').forEach((el) => {
      const off = Number(el.dataset.offset ?? 0)
      el.textContent = off === 0 ? hhmm : `${pad((now.getHours() + off + 24) % 24)}:00`
    })
    // the RSVP counts down to a week after the arrival (the storyboard's value), every second
    const target = now.getTime() + 7 * 864e5
    const count = () => {
      const left = Math.max(0, Math.floor((target - Date.now()) / 1000))
      ;[Math.floor(left / 86400), Math.floor((left % 86400) / 3600), Math.floor((left % 3600) / 60), left % 60].forEach((v, i) =>
        fill(`rsvp-${i}`, pad(v)),
      )
    }
    count()
    const counting = window.setInterval(count, 1000)

    // the studio's brightness behind the bar, by the hour (the wall's luminance at the bar's height): the islands darken
    // over the light paper (README #71) and read it as dark at night
    const light = document.documentElement.dataset.light ?? 'day'
    const lum = String({ morning: 0.84, day: 0.87, evening: 0.7, night: 0.14 }[light] ?? 0.87)
    section.dataset.lum = lum

    // the featured screen: the chapter chosen at the entrance, Weddings by default (#45)
    const chosen = c1.chapter ?? 'weddings'
    section.querySelectorAll<HTMLElement>('.m-card').forEach((card) => {
      card.toggleAttribute('data-featured', card.dataset.chapter === chosen)
    })

    // everything the name shapes
    const menuHello = document.querySelector<HTMLElement>('.menu-hello')
    const compose = (raw: string) => {
      const name = raw.trim().replace(/\s+/g, ' ').slice(0, 18)
      c1.name = name || undefined
      fill('template-title', name || method.template.title)
      fill('wedding-title', name ? fillIn(s.wedding.named, name) : fillIn(s.wedding.title))
      fill('wedding-named-line', fillIn(s.wedding.namedLine))
      show('wedding-named-line', !!name)
      fill('rsvp-title', name ? fillIn(s.rsvp.named, name) : s.rsvp.title)
      fill('portfolio-title', name || s.portfolio.title)
      fill('portfolio-initial', (name || weekday).charAt(0).toUpperCase())
      fill('portfolio-line', fillIn(name ? s.portfolio.namedLine : s.portfolio.line))
      fill('exhibition-title', name ? fillIn(s.exhibition.named, name) : fillIn(s.exhibition.title))
      fill('event-title', fillIn(s.event.title))
      fill('event-line', name ? fillIn(s.event.named, name) : s.event.line)
      fill('guide-title', name ? fillIn(s.guide.named, name) : s.guide.title)
      fill('guide-arrives', name ? fillIn(s.guide.arrives, name) : s.guide.rows[2])
      // the cover: with a name, the name is its title (#49); a first chapter, or the second for who came back (#66)
      const nth = c1.arrival?.returning ? 'second' : 'first'
      fill('cover-kicker', name ? method.cover.named.replace(' {name}', '').replace('{name}', '') : method.cover.title)
      fill('cover-title', name || method.cover.untitled.replace('first', nth))
      // with a name the line says which chapter it is; without one the title already does ("Your first chapter")
      const begun = method.cover.begun.replace('a first', `a ${nth}`)
      fill('cover-date', fillIn(name ? begun : begun.replace(/^a \w+ chapter, /, '')))
      fill('close-for', name ? method.closeNamed.replace('{name}', name) : '')
      show('close-for', !!name)
      fill('cta', name ? contact.ctaNamed.replace('{name}', name) : contact.cta)
      section.toggleAttribute('data-named', !!name)
      if (menuHello) {
        menuHello.textContent = name ? nav.hello.replace('{name}', name) : ''
        menuHello.hidden = !name
      }
    }
    compose(c1.name ?? '')

    // Make it yours: composed as the visitor writes, after a short pause (~150 ms, interactions.md §3)
    const input = section.querySelector<HTMLInputElement>('#m-name')
    let typing = 0
    const onInput = () => {
      clearTimeout(typing)
      typing = window.setTimeout(() => compose(input?.value ?? ''), 150)
    }
    input?.addEventListener('input', onInput)
    if (input && c1.name) input.value = c1.name

    // the held scene; with reduced motion the final state stays as it is, read by scrolling
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const stopStage = reduce ? () => {} : runStage(section, () => c1.chapter ?? 'weddings', (ph) => (ph === 'pre' || ph === '11' ? '0.12' : lum))

    return () => {
      stopStage()
      clearInterval(counting)
      clearTimeout(typing)
      input?.removeEventListener('input', onInput)
    }
  }, [])
  return null
}
