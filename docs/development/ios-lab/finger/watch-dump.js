// watch-dump.js (12 Nov): what watch.js saw — the stops, the notes, frames over 50 ms
const W = window.__w
if (!W) return 'no watch (reloaded?)'
return ['stops: ' + W.rests.join(' '), 'long frames (>50 ms): ' + W.long, ...W.log.map((n) => `  ${n.t}ms y${n.y} ${n.k}: ${n.v}`)].join('\n')
