/* V5 on-device diagnostic (1 Nov 2026), from ios-1013/hud.js. Served only by proxy.mjs on its own port; never part of the site. */
;(function () {
  var FLAGS = {
    // 7 Nov: the Method's stage in flow, held by a scroll-driven animation (the reverted attempt, CSS only); with and without the
    // studio's reflection above the screen (-webkit-box-reflect), the suspect for what broke on the iPhone
    flow: ['Method em fluxo', '@media (prefers-reduced-motion:no-preference) and (max-width:899px){@supports (animation-timeline:view()){:root[data-js] .method{view-timeline:--m-hold block}:root[data-js] .method .m-stage{position:relative !important;top:calc(-1*var(--m-lift,0px)) !important;margin-top:0 !important;animation:m-hold-x linear both;animation-timeline:--m-hold;animation-range:contain 0% contain calc(0% + var(--screen)*6.7)}:root[data-js] .method.m-leaving .m-stage{position:fixed !important;animation:none}}}@keyframes m-hold-x{from{transform:translateY(0)}to{transform:translateY(calc(var(--screen)*6.7))}}'],
    flownoref: ['Method em fluxo, sem reflexo', '@media (prefers-reduced-motion:no-preference) and (max-width:899px){@supports (animation-timeline:view()){:root[data-js] .method{view-timeline:--m-hold block}:root[data-js] .method .m-stage{position:relative !important;top:calc(-1*var(--m-lift,0px)) !important;margin-top:0 !important;animation:m-hold-x linear both;animation-timeline:--m-hold;animation-range:contain 0% contain calc(0% + var(--screen)*6.7)}:root[data-js] .method.m-leaving .m-stage{position:fixed !important;animation:none}}}@keyframes m-hold-x{from{transform:translateY(0)}to{transform:translateY(calc(var(--screen)*6.7))}}:root[data-js] .method .m-wipe-in .m-studio{-webkit-box-reflect:none !important;top:0 !important}'],
    flowlayers: ['Method em fluxo, sem reflexo, camadas', '@media (prefers-reduced-motion:no-preference) and (max-width:899px){@supports (animation-timeline:view()){:root[data-js] .method{view-timeline:--m-hold block}:root[data-js] .method .m-stage{position:relative !important;top:calc(-1*var(--m-lift,0px)) !important;margin-top:0 !important;animation:m-hold-x linear both;animation-timeline:--m-hold;animation-range:contain 0% contain calc(0% + var(--screen)*6.7)}:root[data-js] .method.m-leaving .m-stage{position:fixed !important;animation:none}}}@keyframes m-hold-x{from{transform:translateY(0)}to{transform:translateY(calc(var(--screen)*6.7))}}:root[data-js] .method .m-wipe-in .m-studio{-webkit-box-reflect:none !important;top:0 !important}:root[data-js] .method .m-stage > *, :root[data-js] .method .m-head > *, :root[data-js] .method .m-card, :root[data-js] .method .m-end > *{will-change:transform,opacity}'],
    noref: ['Method sticky, sem reflexo', ':root[data-js] .method .m-wipe-in .m-studio{-webkit-box-reflect:none !important;top:0 !important}'],
    single: ['Cor única no Work', '.w-ground{background:var(--frame) !important}html,body{background:var(--frame) !important}'],
    bg: ['Fundo magenta', 'html,body{background:#ff00c8 !important}'],
    rulers: ['Réguas verde/azul', 'body::before,body::after{content:"";position:fixed;z-index:2147483000;left:0;right:0;height:230px;pointer-events:none}body::before{top:-200px;background:#00ff40}body::after{bottom:-200px;background:#00a0ff}'],
    bleed: ['Filme a sangrar', '.entrance{overflow:visible !important}.e-film{top:-300px !important;bottom:-300px !important}'],
  }
  var flags = {}
  try { (sessionStorage.getItem('__v5flags') || '').split(',').forEach(function (f) { if (FLAGS[f]) flags[f] = true }) } catch { /* no storage: no switch */ }
  var css = Object.keys(flags).map(function (f) { return FLAGS[f][1] }).join('')
  if (css) { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st) }
  var R = document.documentElement, vv = window.visualViewport || null
  var T = { ua: navigator.userAgent, flags: Object.keys(flags), rows: [], ev: [], marks: [], env: null, envEnd: null, started: null,
    cols: ['t', 'scrollY', 'innerH', 'vvH', 'vvTop', 'clientH', 'dvh', 'entTop', 'entBottom', 'stageTop', 'stageBottom', 'fixedTop', 'fixedBottom', 'barTop', 'pass', 'ch', 'section', 'menu'] }
  var recording = false, t0 = 0
  var now = function () { return +(performance.now() - t0).toFixed(1) }
  var note = function (n, d) { if (recording) T.ev.push([now(), n, d === undefined ? null : d]) }
  var ruler = function (u) { var d = document.createElement('div'); d.style.cssText = 'position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none;height:100' + u; return d }
  var rD = ruler('dvh'), rS = ruler('svh'), rL = ruler('lvh'), rV = ruler('vh')
  /* a fixed box pinned to both edges: where the browser really puts "the top" and "the bottom" of the screen */
  var edge = document.createElement('div'); edge.style.cssText = 'position:fixed;top:0;bottom:0;left:0;width:0;visibility:hidden;pointer-events:none'
  var q = function (s) { return document.querySelector(s) }
  var rect = function (s) { var e = q(s); return e ? e.getBoundingClientRect() : null }
  var box = function (s) { var r = rect(s); return r ? [+r.left.toFixed(1), +r.top.toFixed(1), +r.right.toFixed(1), +r.bottom.toFixed(1)] : null }
  var frame = function () {
    if (!recording) return
    var e = rect('#top'), s = rect('.w-stage'), f = edge.getBoundingClientRect(), b = rect('.bar')
    T.rows.push([now(), +scrollY.toFixed(1), innerHeight, vv ? +vv.height.toFixed(1) : null, vv ? +vv.offsetTop.toFixed(1) : null, R.clientHeight, rD.offsetHeight, e ? +e.top.toFixed(1) : null, e ? +e.bottom.toFixed(1) : null, s ? +s.top.toFixed(1) : null, s ? +s.bottom.toFixed(1) : null, +f.top.toFixed(1), +f.bottom.toFixed(1), b ? +b.top.toFixed(1) : null, R.dataset.pass || '', (q('.work') || { dataset: {} }).dataset.ch || '', R.dataset.section || '', R.dataset.menu || '',
      // 7 Nov: the Method's stage held in flow (method.css): section top, stage top/bottom, its transform's y, phase, leap/leaving
      (function () { var m = q('#method'), st = m && m.querySelector('.m-stage'); if (!m || !st) return null; var r = m.getBoundingClientRect(), t = st.getBoundingClientRect(), mx = getComputedStyle(st).transform, y = mx && mx !== 'none' ? +mx.split(',')[5] : 0
        return [+r.top.toFixed(1), +t.top.toFixed(1), +t.bottom.toFixed(1), +(+y).toFixed(1), m.dataset.phase || '', 'leap' in R.dataset ? 1 : 0, m.classList.contains('m-leaving') ? 1 : 0, getComputedStyle(st).position, getComputedStyle(m).getPropertyValue('--m-lift').trim()] })(),
      // 7 Nov (Mac): the entrance's film — its box, its transform, the video (ready, playing, time, opacity), the poster, the phase
      (function () { var f = q('.e-film'), v = q('.e-video'), z = q('.e-zoom'); if (!f) return null; var r = f.getBoundingClientRect()
        return [+r.top.toFixed(1), +r.height.toFixed(1), getComputedStyle(f).transform, v ? v.readyState : -1, v && !v.paused ? 1 : 0, v ? +v.currentTime.toFixed(2) : 0, v ? getComputedStyle(v).opacity : '', z ? getComputedStyle(z).transform : '', R.dataset.entrance || '', R.dataset.film || ''] })()])
    if (T.rows.length > 9000) stop('full'); else requestAnimationFrame(frame)
  }
  var envNow = function () {
    var d = document.createElement('div'); d.style.cssText = 'position:fixed;visibility:hidden;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'; document.body.appendChild(d)
    var c = getComputedStyle(d), safe = [c.paddingTop, c.paddingRight, c.paddingBottom, c.paddingLeft]; d.remove()
    var meta = function (n) { var m = q('meta[name="' + n + '"]'); return m ? m.content : null }
    return { inner: [innerWidth, innerHeight], outer: [outerWidth, outerHeight], screen: [screen.width, screen.height], avail: [screen.availWidth, screen.availHeight], vv: vv ? [vv.width, vv.height, vv.scale, vv.offsetTop] : null, client: R.clientHeight, dvh: rD.offsetHeight, svh: rS.offsetHeight, lvh: rL.offsetHeight, vh: rV.offsetHeight, dpr: devicePixelRatio, safe: safe, viewport: meta('viewport'), theme: meta('theme-color'), htmlBg: getComputedStyle(R).backgroundColor, bodyBg: getComputedStyle(document.body).backgroundColor, room: getComputedStyle(R).getPropertyValue('--room'), standalone: !!navigator.standalone, top: box('#top'), film: box('.e-film'), stage: box('.w-stage'), bar: box('.bar'), final: box('.e-final'), scrollY: scrollY, docH: R.scrollHeight }
  }
  var start = function () { if (recording) return; T.rows = []; T.ev = []; T.marks = []; t0 = performance.now(); T.started = new Date().toISOString(); T.env = envNow(); recording = true; paint(); requestAnimationFrame(frame) }
  var stop = function (why) {
    if (!recording) return
    note('stop', why || 'button'); recording = false; T.envEnd = envNow(); paint('a enviar…')
    var body = JSON.stringify(T)
    fetch('/__diag/log', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: body }).then(function (r) { if (!r.ok) throw r.status; return r.text() }).then(function () { paint('ENVIADO ✓ ' + Math.round(body.length / 1024) + ' kB') }).catch(function (e) { paint('FALHOU: ' + e) })
  }
  window.addEventListener('resize', function () { note('resize', [innerHeight, R.clientHeight, rD.offsetHeight]) })
  if (vv) vv.addEventListener('resize', function () { note('vv.resize', [+vv.height.toFixed(1), +vv.offsetTop.toFixed(1)]) })
  ;['touchstart', 'touchend', 'touchcancel'].forEach(function (n) { addEventListener(n, function (e) { var t = e.changedTouches[0]; note(n, t ? [Math.round(t.clientX), Math.round(t.clientY)] : null) }, { passive: true, capture: true }) })

  var wrap = document.createElement('div')
  wrap.id = 'v5-hud'
  wrap.style.cssText = 'position:fixed;right:4px;top:42%;z-index:2147483647;font:12px/1.35 -apple-system,system-ui,sans-serif;color:#fff;-webkit-user-select:none;user-select:none;text-align:right'
  var btn = function (label, fn, bg) { var b = document.createElement('button'); b.textContent = label; b.style.cssText = 'display:block;margin:0 0 5px auto;padding:9px 11px;border:0;border-radius:7px;font:inherit;color:#fff;background:' + (bg || 'rgba(0,0,0,.78)'); b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn() }, true); return b }
  var bRec, bMark, status, panel, open = false
  var paint = function (msg) {
    bRec.textContent = recording ? '■ parar e enviar' : '● rec'; bRec.style.background = recording ? '#c22' : 'rgba(0,0,0,.78)'; bMark.style.display = recording ? 'block' : 'none'
    status.textContent = msg || (recording ? 'a gravar' : (T.flags.length ? 'Teste: ' + T.flags.join(', ') : 'diag'))
  }
  var setFlag = function (f) { var one = {}; if (!flags[f]) one[f] = true; try { sessionStorage.setItem('__v5flags', Object.keys(one).join(',')) } catch { /* no storage: no switch */ } ; location.replace(location.pathname) }
  var mount = function () {
    ;[rD, rS, rL, rV, edge].forEach(function (d) { document.body.appendChild(d) })
    status = document.createElement('div'); status.style.cssText = 'margin:0 0 5px auto;padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.65);max-width:52vw'
    bRec = btn('● rec', function () { if (recording) stop(); else start() })
    bMark = btn('✕ vi agora', function () { T.marks.push(now()); note('MARK', T.marks.length); status.textContent = 'marca ' + T.marks.length })
    var file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*,video/*'; file.multiple = true; file.style.display = 'none'
    file.addEventListener('change', function () {
      var list = [].slice.call(file.files), done = 0
      var next = function () {
        if (!list.length) { paint('ENVIADO ✓ ' + done + ' ficheiro(s)'); file.value = ''; return }
        var f = list.shift(); paint('a enviar ' + (done + 1) + '…')
        fetch('/__diag/file?name=' + encodeURIComponent(f.name), { method: 'POST', body: f }).then(function (r) { if (!r.ok) throw r.status; done++; next() }).catch(function (e) { paint('FALHOU: ' + e) })
      }
      next()
    })
    var bFile = btn('📎 enviar foto/vídeo', function () { file.click() })
    panel = document.createElement('div'); panel.style.display = 'none'
    Object.keys(FLAGS).forEach(function (f) { panel.appendChild(btn((flags[f] ? '☑ ' : '☐ ') + FLAGS[f][0], function () { setFlag(f) }, flags[f] ? '#274' : null)) })
    var bMore = btn('testes', function () { open = !open; panel.style.display = open ? 'block' : 'none' })
    ;[status, bRec, bMark, bFile, bMore, panel, file].forEach(function (n) { wrap.appendChild(n) })
    R.appendChild(wrap); paint()
  }
  if (document.body) mount(); else addEventListener('DOMContentLoaded', mount)
  // 7 Nov (Mac): the remote console (proxy.mjs /__diag/cmd → /__diag/res). The body runs as an async function; what it returns comes
  // back as JSON. Helpers: flag('flow' | '') sets one test switch and reloads, as the HUD's buttons do.
  window.__flag = function (f) { try { sessionStorage.setItem('__v5flags', f || '') } catch { /* no storage: no switch */ } ; setTimeout(function () { location.replace(location.pathname) }, 300); return 'reloading with ' + (f || 'no flag') }
  var poll = function () {
    // only the tab in view answers: Safari keeps the tabs openurl left behind alive, and one of them took the commands
    if (document.visibilityState !== 'visible') return setTimeout(poll, 1000)
    fetch('/__diag/cmd', { cache: 'no-store' }).then(function (r) { return r.status === 200 ? r.json() : null }).then(function (c) {
      if (!c) return poll()
      var done = function (v) { var s; try { s = JSON.stringify(v === undefined ? null : v) } catch { s = JSON.stringify(String(v)) } ; fetch('/__diag/res?id=' + c.id, { method: 'POST', body: s }).then(poll, poll) }
      try { Promise.resolve(new Function('return (async () => {' + c.js + '})()')()).then(done, function (e) { done({ error: String(e) }) }) } catch (e) { done({ error: String(e) }) }
    }).catch(function () { setTimeout(poll, 1000) })
  }
  poll()
  // ?autorec=<s>: records from the load for that many seconds and sends the tape (the entrance, with no hand on the button)
  var auto = +(new URLSearchParams(location.search).get('autorec') || 0)
  if (auto) { var go = function () { start(); setTimeout(function () { stop('autorec') }, auto * 1000) }; if (document.body) setTimeout(go, 0); else addEventListener('DOMContentLoaded', go) }
})()
