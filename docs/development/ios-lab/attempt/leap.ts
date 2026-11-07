/*
  A scroll made by the site itself (a link, the menu, the keyboard bringing a phase), marked on <html> as data-leap while it lands.
  On a phone the held stages are content of the page, held still by a scroll-driven animation (method.css, owner, 7 Nov: so that Safari
  draws them behind its Dynamic Island). A finger's scroll moves the page and the animation together; a jump made by script did not:
  for ~10 frames after it the stage stood where the old scroll had put it and the page beneath showed through (Xiaomi, 7 Nov, a jump
  from 7 to 10). While data-leap is on, the stage is sticky again, held by the browser itself, as before.
*/
let unmark = 0

export function leap(top: number, behavior: ScrollBehavior = 'auto') {
  const root = document.documentElement
  root.dataset.leap = ''
  clearTimeout(unmark)
  const done = () => {
    clearTimeout(unmark)
    // a few frames more: the scenes answer a jump on the main thread, and the stage's animation is brought up to date after them
    unmark = window.setTimeout(() => delete root.dataset.leap, 400)
  }
  if (behavior === 'smooth') {
    addEventListener('scrollend', done, { once: true })
    unmark = window.setTimeout(done, 1500)
  } else done()
  scrollTo({ top, behavior })
}
