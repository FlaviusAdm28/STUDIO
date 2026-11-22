// The conductor's stroke detector, today's and candidates, as a function of each wheel event: { t: arrival ms, ts: the event's own time
// (e.timeStamp), dy (px) } → true for a new stroke. Mirrors conductor.ts onWheel.
const GAP = 300
export function make(variant = 'today', o = {}) {
  let wheelAt = -1e9, tsAt = -1e9, wheelWay = 0, wheelPeak = 0, wheelPrev = 0, prevRaw = 0, falling = false, trough = Infinity, rises = 0, strokeAt = 0
  const spans = []
  const K = o.k ?? 1.5
  // v2: the recent events of the stroke, in their own time, for the veto
  const recent = []
  let strokeTs = -1e9
  let troughSpeed = Infinity
  const V = o.v ?? 1.6, WIN = o.win ?? 40, MINSPAN = o.min ?? 4
  return (e) => {
    const raw = Math.abs(e.dy)
    if (!raw) return false
    const way = Math.sign(e.dy)
    let a = raw
    let now = variant === 'v5' || variant === 'v6' || variant === 'v7' ? e.ts : e.t
    if (variant === 'v1') {
      now = e.ts
      // how long this event stands for, in the hand's own time; the stroke's cadence (a trackpad 8.3 ms, 16.7 at 60 Hz)
      const span = e.ts - tsAt
      const cad = spans.length ? [...spans].sort((x, y) => x - y)[Math.floor(spans.length / 2)] : 8.3
      // an event the browser joined (a busy frame): the sum of those it stands for, over their time — taken at the stroke's cadence.
      // Only one larger than the one before: a pause of a wheel (the same click after a while) is not a sum
      if (span > K * cad && span < GAP && (!o.bigger || raw > prevRaw)) a = (raw * cad) / span
      if (span > 0 && span < 40) { spans.push(Math.min(20, Math.max(4, span))); if (spans.length > 8) spans.shift() }
    }
    rises = a > wheelPrev ? rises + 1 : 0
    if (falling) trough = Math.min(trough, a)
    const sp = raw / Math.max(o.cad ?? 8, e.ts - tsAt)
    if (falling && way === wheelWay) troughSpeed = Math.min(troughSpeed, sp)
    const gap = variant === 'v5' || variant === 'v6' || variant === 'v7' ? e.ts - tsAt > GAP : now - (variant === 'today' ? wheelAt : tsAt) > GAP
    const r = [gap, raw > 3 && wheelWay !== 0 && way !== wheelWay, a > 15 && a > 2.5 * wheelPrev && wheelPrev < 0.4 * wheelPeak, falling && rises >= 2 && a > 8 && a >= 2 * trough]
    const evSpeed = raw / Math.max(o.cad ?? 8, e.ts - tsAt)
    if (variant === 'v4' || variant === 'v5' || variant === 'v6' || variant === 'v7') {
      if (r[2] && !r[0] && !r[1] && recent.length) {
        const last = recent[recent.length - 1][0]
        let from = last - WIN
        for (let k = recent.length - 1; k > 0; k--) { const [t1, x1] = recent[k], [t0, x0] = recent[k - 1]; if (t1 - t0 >= 20 && x1 <= 0.7 * x0) { from = Math.max(from, t0); break } }
        const inWin = recent.filter(([t]) => t > from)
        const before = variant === 'v7'
          ? inWin.reduce((s, [, x]) => s + x, 0) / Math.max(8, inWin.reduce((s, r) => s + r[2], 0))
          : inWin.reduce((s, [, x]) => s + x, 0) / Math.max(8, last - from)
        // v6: a long span that does not carry its own time's worth of the stroke is a silence, not a sum: a new stroke after a pause
        const span = e.ts - last
        const silence = (variant === 'v6' || variant === 'v7') && span > 16 && raw < 0.5 * before * span
        if (!silence && raw / Math.max(MINSPAN, span) < V * before) r[2] = false
      }
      if (r[3] && !r[0] && !r[1] && evSpeed < (o.v4 ?? 2) * troughSpeed) r[3] = false
      if ((r[2] || r[3]) && !r[0] && !r[1] && e.ts - strokeTs < (o.refr ?? 150)) { r[2] = false; r[3] = false }
    }
    if (variant === 'v2' || variant === 'v3') {
      // A rise inside a stroke (jump, rise) counts only if the stroke really goes faster in its own time: an event the browser joined
      // (a busy frame) carries the sum of those it stands for over as long, its speed the same as before it
      const which = o.jumpOnly ? r[2] : r[2] || r[3]
      if (which && !r[0] && !r[1] && recent.length) {
        const last = recent[recent.length - 1][0]
        // from a touch on: an event after a pause in the hand's own time, smaller than the one before it (the finger stopped the
        // momentum); a joined event after a busy frame is larger, never smaller
        let from = last - WIN
        if (o.dip) for (let k = recent.length - 1; k > 0; k--) { const [t1, x1] = recent[k], [t0, x0] = recent[k - 1]; if (t1 - t0 >= 20 && x1 <= 0.7 * x0) { from = Math.max(from, t0); break } }
        const inWin = recent.filter(([t]) => t > from)
        const before = inWin.reduce((s, [, x]) => s + x, 0) / Math.max(8, last - from)
        const nowSpeed = raw / Math.max(MINSPAN, e.ts - last)
        if (nowSpeed < V * before) { r[2] = false; if (!o.jumpOnly) r[3] = false; if (o.log) console.log('veto', e.t, raw, nowSpeed.toFixed(2), before.toFixed(2)) }
      }
      // v3: and never within REFR ms of the stroke's own start, the same way: a hand does not begin again that soon (the owner's quickest
      // strokes ~0.3 s apart); a stroke's own start with its values uneven ("19 7 40 8 36", Chrome) counted it three times in 58 ms
      if (variant === 'v3' && (r[2] || r[3]) && !r[0] && !r[1] && e.ts - strokeTs < (o.refr ?? 150)) { r[2] = false; r[3] = false }
    }
    const f = r.some(Boolean)
    if (f && (r[0] || r[1])) recent.length = 0
    // every event of the stroke's way (a tremor the other way round is not the stroke)
    if (way === wheelWay || f) { recent.push([e.ts, raw, Math.min(100, Math.max(4, e.ts - tsAt))]); while (recent.length && e.ts - recent[0][0] > 200) recent.shift() }
    wheelAt = e.t
    tsAt = e.ts
    if (raw > 3 || f) wheelWay = way
    if (f) { wheelPeak = 0; falling = false; trough = Infinity; troughSpeed = Infinity; rises = 0; strokeAt = now; strokeTs = e.ts }
    wheelPeak = Math.max(wheelPeak, a)
    if (!falling && now - strokeAt > 150 && a < 0.3 * wheelPeak) { falling = true; trough = a; troughSpeed = sp }
    if (f || raw > 3 || way === wheelWay) { wheelPrev = a; prevRaw = raw }
    return f ? ['gap', 'way', 'jump', 'rise'][r.indexOf(true)] : false
  }
}
