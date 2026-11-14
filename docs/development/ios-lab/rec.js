/* V5 desktop session recorder (14 Nov 2026). Served only by proxy.mjs in "rec" mode on its own port (3140); never part of the site.
   The owner browses the site their own way (Chrome, Safari) with ● gravar on; everything is sent to out/<id>-rec.jsonl every 5 s:
   - what the hand did: wheel (dx, dy, mode), keys, pointer down/up, clicks (on what), touches, focus moving, resize, the page hidden
   - what the page did: scrollY every frame it changed; the site's state each time it changes (section, the Work's chapter and pass,
     the Method's and the About's phases, the menu, the Contact's passage, the jump mark, snapping, the bar's word, the page's colours);
     every attribute change on <html>; frames longer than 50 ms; errors, rejections, console errors and warnings
   - ⚑ (or Option+B): "I saw something here", with an optional note typed in the box that opens.
   The recording carries on across a reload (sessionStorage) and says the wall-clock time it started, to line it up with a screen
   recording of the Mac (Cmd+Shift+5). Read it with rec-read.mjs. */
;(function () {
  var R = document.documentElement
  var KEY = '__v5rec'
  var saved = null
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null') } catch { saved = null }
  var on = false, id = '', t0 = 0, wall0 = 0, buf = [], marks = 0, last = {}, lastY = NaN, lastFrame = 0
  var now = function () { return Math.round(performance.now() - t0) }
  var push = function (k, d) { if (on) buf.push([now(), k, d === undefined ? null : d]) }

  // ---- what something is, in a few words: tag#id.class "text" ----
  var what = function (el) {
    if (!el || !el.tagName) return null
    var s = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')
    var a = el.closest && el.closest('a[href], button')
    if (a && a !== el) s += ' in ' + a.tagName.toLowerCase() + (a.getAttribute('href') ? '[' + a.getAttribute('href') + ']' : '') + (typeof a.className === 'string' && a.className ? '.' + a.className.split(' ')[0] : '')
    else if (el.getAttribute && el.getAttribute('href')) s += '[' + el.getAttribute('href') + ']'
    var t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)
    return t ? s + ' "' + t + '"' : s
  }

  // ---- the site's state, read each frame and written when it changes ----
  var q = function (s) { return document.querySelector(s) }
  var theme = q('meta[name="theme-color"]')
  var state = function () {
    var d = R.dataset, w = q('.work'), m = q('#method'), a = q('#about'), qs = q('#questions'), c = q('#contact'), sec = q('.bar-sec')
    var cs = getComputedStyle(R)
    var open = qs ? [].indexOf.call(qs.querySelectorAll('.q-row'), qs.querySelector('.q-row.is-open')) : -1
    return {
      sec: d.section || '', pass: (d.pass || '') + ('passZone' in d ? 'Z' : '') + ('passHold' in d ? 'H' : ''),
      ch: w ? w.dataset.ch || '' : '', m: m ? (m.dataset.phase || '') + (m.dataset.passage !== undefined ? '~' : '') + (m.dataset.near !== undefined ? 'n' : '') : '',
      a: a ? (a.dataset.phase || '') + (a.dataset.passage !== undefined ? '~' : '') + (a.dataset.story !== undefined ? 's' : '') : '',
      q: qs ? (qs.classList.contains('q-in') ? 'in' : '-') + (open >= 0 ? ' open' + open : '') : '',
      c: (R.classList.contains('c-dusk') ? 'dusk' : '') + ('cRun' in d ? ' run' : '') + ('cOn' in d ? ' on' : '') + ('cHold' in d ? ' hold' : '') + (c && c.classList.contains('c-playing') ? ' film' : ''),
      menu: d.menu || '', jump: d.jump === undefined ? '' : d.jump || '(on)', ent: d.entrance || '',
      snap: cs.scrollSnapType, ovf: cs.overflowY + (document.body ? '/' + getComputedStyle(document.body).overflowY : ''),
      bar: sec ? sec.textContent : '', bg: cs.backgroundColor, theme: theme ? theme.content : '',
      edge: (m && m.dataset.edge || '') + '|' + (a && a.dataset.edge || '')
    }
  }
  var frame = function (ts) {
    if (!on) return
    if (lastFrame && ts - lastFrame > 50) push('slow', Math.round(ts - lastFrame))
    lastFrame = ts
    var y = Math.round(scrollY)
    if (y !== lastY) { buf.push([now(), 'y', y]); lastY = y }
    var s = state(), ch = {}, any = false
    for (var k in s) if (s[k] !== last[k]) { ch[k] = s[k]; any = true }
    if (any) { push('state', ch); last = s }
    requestAnimationFrame(frame)
  }

  // ---- sending: every 5 s, and as the page goes ----
  var send = function (final) {
    if (!buf.length && !final) return
    var lines = buf.map(function (r) { return JSON.stringify(r) }).join('\n') + '\n'
    buf = []
    var url = '/__diag/rec?id=' + id
    if (final && navigator.sendBeacon) { navigator.sendBeacon(url, lines); return }
    fetch(url, { method: 'POST', body: lines, keepalive: true }).catch(function () { status('não enviou') })
  }
  var timer = 0
  var begin = function (resume) {
    on = true; t0 = performance.now(); last = {}; lastY = NaN; lastFrame = 0
    if (!resume) { id = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); wall0 = Date.now() } else { id = resume.id; wall0 = resume.wall0 }
    var t = Date.now() - wall0
    buf.push([0, resume ? 'reload' : 'start', { wall: new Date().toISOString(), sinceStart: t, url: location.href, ua: navigator.userAgent,
      inner: [innerWidth, innerHeight], dpr: devicePixelRatio, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      hover: matchMedia('(hover: hover)').matches }])
    try { sessionStorage.setItem(KEY, JSON.stringify({ id: id, wall0: wall0 })) } catch { /* no storage: no carrying on */ }
    timer = setInterval(send, 5000)
    requestAnimationFrame(frame)
    paint()
  }
  var end = function () {
    push('stop', null); on = false; clearInterval(timer); send(false)
    try { sessionStorage.removeItem(KEY) } catch { /* nothing */ }
    paint(); status('gravação ' + id + ' enviada')
  }
  addEventListener('pagehide', function () { if (on) { push('pagehide', null); send(true) } })

  // ---- the hand ----
  addEventListener('wheel', function (e) { push('wheel', [Math.round(e.deltaX), Math.round(e.deltaY), e.deltaMode]) }, { passive: true, capture: true })
  addEventListener('keydown', function (e) {
    if (e.altKey && e.code === 'KeyB') { e.preventDefault(); mark(); return }
    if (e.target && e.target.closest && e.target.closest('.__rec')) return
    push('key', (e.shiftKey ? 'Shift+' : '') + (e.metaKey ? 'Cmd+' : '') + e.key)
  }, true)
  ;['pointerdown', 'pointerup', 'pointercancel'].forEach(function (n) {
    addEventListener(n, function (e) { if (e.target.closest && e.target.closest('.__rec')) return; push(n.replace('pointer', 'p.'), [Math.round(e.clientX), Math.round(e.clientY), e.pointerType, what(e.target)]) }, { passive: true, capture: true })
  })
  addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.__rec')) return; push('click', what(e.target)) }, true)
  ;['touchstart', 'touchend', 'touchcancel'].forEach(function (n) { addEventListener(n, function (e) { var t = e.changedTouches[0]; push(n, t ? [Math.round(t.clientX), Math.round(t.clientY)] : null) }, { passive: true, capture: true }) })
  addEventListener('focusin', function (e) { if (e.target.closest && e.target.closest('.__rec')) return; push('focus', what(e.target)) }, true)
  addEventListener('resize', function () { push('resize', [innerWidth, innerHeight]) })
  addEventListener('hashchange', function () { push('hash', location.hash) })
  addEventListener('popstate', function () { push('popstate', location.hash) })
  document.addEventListener('visibilitychange', function () { push('visible', document.visibilityState) })
  addEventListener('scrollend', function () { push('scrollend', Math.round(scrollY)) })

  // ---- what went wrong ----
  addEventListener('error', function (e) { push('ERROR', (e.message || 'resource ' + what(e.target)) + (e.filename ? ' @' + e.filename.split('/').pop() + ':' + e.lineno : '')) }, true)
  addEventListener('unhandledrejection', function (e) { push('REJECTION', String(e.reason && (e.reason.stack || e.reason.message) || e.reason).slice(0, 400)) })
  ;['error', 'warn'].forEach(function (n) {
    var orig = console[n]
    console[n] = function () { push('console.' + n, [].map.call(arguments, function (a) { try { return typeof a === 'string' ? a : JSON.stringify(a) } catch { return String(a) } }).join(' ').slice(0, 400)); return orig.apply(console, arguments) }
  })

  // ---- every change of <html>'s attributes (the site's own marks) ----
  new MutationObserver(function (rs) {
    if (!on) return
    rs.forEach(function (r) { if (r.attributeName !== 'style') push('html', r.attributeName + '=' + (R.getAttribute(r.attributeName) || '').slice(0, 60)) })
  }).observe(R, { attributes: true })

  // ---- the panel: bottom left, small; never part of what is recorded ----
  var wrap, bRec, bMark, note, msg
  var status = function (t) { if (msg) msg.textContent = t || '' }
  var paint = function () {
    if (!bRec) return
    bRec.textContent = on ? '■ parar' : '● gravar'
    bRec.style.background = on ? '#c22' : 'rgba(0,0,0,.75)'
    bMark.style.display = on ? 'inline-block' : 'none'
    if (on) status('a gravar · ⚑ ou ⌥B marca um bug')
  }
  var mark = function () {
    if (!on) return
    marks++
    push('MARK', { n: marks, y: Math.round(scrollY) })
    status('⚑ ' + marks + ' marcado — escreve o que viste (Enter) ou ignora')
    note.style.display = 'block'; note.value = ''; note.dataset.n = String(marks)
    setTimeout(function () { note.focus({ preventScroll: true }) }, 0)
  }
  var btn = function (label, fn) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = label
    b.style.cssText = 'margin:0 6px 0 0;padding:7px 10px;border:0;border-radius:8px;font:12px/1 system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.75);cursor:pointer'
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn() })
    return b
  }
  var mount = function () {
    wrap = document.createElement('div'); wrap.className = '__rec'
    wrap.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:2147483647;font:12px/1.3 system-ui,sans-serif;color:#fff;max-width:340px'
    bRec = btn('● gravar', function () { if (on) end(); else begin(null) })
    bMark = btn('⚑ bug', mark)
    msg = document.createElement('div'); msg.style.cssText = 'margin-top:6px;padding:4px 6px;border-radius:6px;background:rgba(0,0,0,.6)'
    note = document.createElement('input'); note.type = 'text'; note.placeholder = 'o que viste? (Enter)'
    note.style.cssText = 'display:none;margin-top:6px;width:320px;padding:6px 8px;border:0;border-radius:6px;font:13px system-ui,sans-serif'
    note.addEventListener('keydown', function (e) {
      e.stopPropagation()
      if (e.key === 'Enter') { push('NOTE', { n: +note.dataset.n, text: note.value }); note.style.display = 'none'; note.blur(); status('nota ' + note.dataset.n + ' guardada') }
      if (e.key === 'Escape') { note.style.display = 'none'; note.blur(); paint() }
    })
    wrap.appendChild(bRec); wrap.appendChild(bMark); wrap.appendChild(msg); wrap.appendChild(note)
    document.body.appendChild(wrap)
    paint()
    if (!on) status('carrega em ● gravar e usa o site')
  }
  if (saved && saved.id) begin(saved)
  if (document.body) mount(); else addEventListener('DOMContentLoaded', mount)
})()
