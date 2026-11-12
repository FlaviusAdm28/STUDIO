// where.js: one word for where the page is (W<chapter>@y, 7…11, 12–14, Q, C, fim) — POST to the lab console (curl --data-binary @where.js localhost:<port>/__diag/run)
const R = document.documentElement, s = R.dataset.section, y = Math.round(scrollY)
const m = document.querySelector('.method'), a = document.querySelector('.about'), w = document.querySelector('.work')
// the end: within the 40–56 px Safari's or Chrome's bar adds or takes (at < 3 px the end with the bar opened read as "C", 11 Nov)
if (R.scrollHeight - innerHeight - scrollY < 60) return 'fim'
if (s === 'contact') return 'C'
if (s === 'questions') return 'Q'
if (a && a.dataset.phase && a.dataset.phase !== 'pre' && s === 'about') return a.dataset.phase
if (m && m.dataset.phase && m.dataset.phase !== 'pre') return m.dataset.phase
if (s === 'work') return 'W' + (w ? w.dataset.ch : '?') + '@' + y
return (s || 'topo') + '@' + y
