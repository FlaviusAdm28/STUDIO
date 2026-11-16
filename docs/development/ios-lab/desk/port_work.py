# The Work's nine pieces, as the site builds them, into the storyboard: their HTML (from the built page), their CSS (work.css,
# the demonstrations), the chapters' own photographs and auras, the glass and its lens. python3 port_work.py <storyboard.html>
import re, sys, json
SP = '/private/tmp/claude-502/-Users-flaviooliveira-WebstormProjects-STUDIO/92a5f06b-8230-4c48-bd21-9a3b26991c6f/scratchpad'
R = '/Users/flaviooliveira/WebstormProjects/STUDIO'
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count: sys.exit(f'expected {count}, found {n}: {old[:100]!r}')
    s = s.replace(old, new)

# ---------- the pieces' HTML, from the built page ----------
b = open(f'{SP}/versions/430c924/.next/server/app/index.html', encoding='utf-8').read()
w = b[b.index('<section id="work"'):b.index('id="method"')]
def inner_div(src, start):
    # the inner HTML of the <div ...> that starts at `start`, nesting counted
    i = src.index('>', start) + 1; depth = 1; k = i
    for m in re.finditer(r'<div\b|</div>', src[i:]):
        depth += 1 if m.group() == '<div' else -1
        if depth == 0: return src[i:i + m.start()]
    raise SystemExit('unbalanced')
pic = re.compile(r'<picture>.*?<img src="/media/v5/(\w+)/([\w-]+?)-(?:\d+)\.jpg"[^>]*/></picture>', re.S)
def local(h):
    h = pic.sub(lambda m: f'<img src="img/site/{m.group(2)}-{"320" if "guests" in m.group(2) else "640"}.jpg" alt="">', h)
    return h.replace('srcSet=', 'data-srcset=').replace('aria-hidden="true"', '')
demos = {}
for ci, c in enumerate(['weddings', 'artists', 'experiences']):
    a = w.index(f'data-c="{c}"', w.index('<article'))
    for j in range(3):
        k = w.index(f'<div class="w-dm" data-j="{j}"', a)
        demos['wae'[ci] + str(j)] = local(inner_div(w, k))
for k, h in demos.items():
    assert '/media/' not in h, (k, re.findall(r'/media/[^"]+', h)[:3])

# ---------- the pieces' CSS, from work.css (the demonstrations), made to the storyboard's frames ----------
css = open(f'{R}/src/components/work/work.css', encoding='utf-8').read().split('\n')[620:1252]
css = '\n'.join(css)
css = css.replace(':root[data-js] ', '')
css = re.sub(r'max\(\s*([\d.]+cqw)\s*,\s*[\d.]+px\s*\)', r'\1', css)
css = re.sub(r'min\(\s*([\d.]+cqw)\s*,\s*[\d.]+px\s*\)', r'\1', css)
css = css.replace('var(--serif)', 'var(--voice)').replace('var(--sans)', 'var(--read)')
for c, k in (('weddings', 'c1'), ('artists', 'c2'), ('experiences', 'c3')):
    css = css.replace(f".w-ch[data-c='{c}']", f'.stack.{k}')
def scope_media(css, query, prefix):
    out, i = [], 0
    while True:
        k = css.find(query, i)
        if k < 0: out.append(css[i:]); break
        out.append(css[i:k])
        o = css.index('{', k); depth = 1; j = o + 1
        while depth:
            depth += {'{': 1, '}': -1}.get(css[j], 0); j += 1
        body = css[o + 1:j - 1]
        body = re.sub(r'(^|})(\s*)([^{}@]+?)\s*\{', lambda m: m.group(1) + m.group(2) + ', '.join(prefix + x.strip() for x in m.group(3).split(',')) + ' {', body)
        out.append(body); i = j
    return ''.join(out)
css = scope_media(css, '@media (min-width: 900px)', '.frame.desk ')
css = scope_media(css, '@media (max-width: 899px)', '.frame.phone ')
assert '@media (min-width' not in css and '@media (max-width' not in css
port_css = ('\n/* ===== the Work\'s pieces as the site builds them (work.css, the demonstrations; ported 16 Nov: cqw minimums in px dropped, the\n'
            '   frames are small; the chapter frames .w-ch[data-c] are the storyboard\'s .stack.c1–c3; desktop/phone media are the frames) ===== */\n'
            '.frame { --tone-0: #ddbf95; --tone-1: #d8ae74; --tone-2: #a9bcdd; --glass-blur-px: 3.1cqw; --glass-desktop-factor: 1; --serif: var(--voice); --sans: var(--read); }\n'
            '.stack .dm.w-dm { container-type: inline-size; overflow: hidden; z-index: 4; }\n'
            '.stack.c1 .dm { border-radius: 50% 50% 0 0 / 24% 24% 0 0; }\n.stack.c2 .dm { border-radius: 2px; }\n'
            '.stack.c3 .dm, .stack.c3 .dm-veil { clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }\n'
            + css + '\n')
rep('</style>', port_css + '</style>', count=s.count('</style>') if s.count('</style>') == 1 else 1) if s.count('</style>') == 1 else None
if s.count('</style>') != 1:
    # several style blocks: the port goes into the first
    i = s.index('</style>'); s = s[:i] + port_css + s[i:]

# ---------- the chapters' own photographs and auras ----------
rep("imgs: ['w002', 'w154', 'w343']", "imgs: ['site/weddings-before-640', 'site/weddings-day-640', 'site/weddings-after-640'], auras: ['site/weddings-before-aura', 'site/weddings-day-aura', 'site/weddings-after-aura']")
rep("imgs: ['studio', 'gallery', 'folio']", "imgs: ['site/artists-always-photo-640', 'site/artists-moment-photo-640', 'site/artists-record-640'], auras: ['site/artists-always-photo-aura', 'site/artists-moment-photo-aura', 'site/artists-record-aura']")
rep("imgs: ['invite', 'concert', 'banquet']", "imgs: ['site/experiences-before-photo-640', 'site/experiences-during-photo-640', 'site/experiences-after-photo-640'], auras: ['site/experiences-before-photo-aura', 'site/experiences-during-photo-aura', 'site/experiences-after-photo-aura']")
rep("stack.querySelector('.aura').style.backgroundImage = `url(${I('a-' + CH[ci].imgs[m])})`;",
    "stack.querySelector('.aura').style.backgroundImage = `url(${I(CH[ci].auras[m])})`;")
# the blade of Weddings is the arch's photograph (the same photograph, README #81)
rep('<div class="bl" aria-hidden="true"><div class="bg" style="background-image:url(${I(\'w002\')})"></div></div>',
    '<div class="bl" aria-hidden="true"><div class="bg" style="background-image:url(${I(\'site/weddings-before-640\')})"></div></div>')

# ---------- the pieces themselves ----------
i = s.index('  const DEMOS = {'); j = s.index('  };\n', i) + len('  };\n')
s = s[:i] + ('  // the nine pieces as the site builds them (work.tsx, from the built page, 16 Nov); fillDemo puts in the visitor\'s date, time and name\n'
             '  const SITE_DM = ' + json.dumps(demos, ensure_ascii=False) + ';\n'
             '  const DEMOS = Object.fromEntries(Object.keys(SITE_DM).map(k => [k, () => SITE_DM[k]]));\n') + s[j:]
rep('${[0, 1, 2].map(j => `<div class="dm" data-key="${c.key}${j}"></div>`).join(\'\')}',
    '${[0, 1, 2].map(j => `<div class="dm w-dm" data-j="${j}" data-key="${c.key}${j}"></div>`).join(\'\')}')
rep("f.el.querySelectorAll('.dm').forEach(d => { d.innerHTML = DEMOS[d.dataset.key](c); });",
    "f.el.querySelectorAll('.dm').forEach(d => { d.innerHTML = DEMOS[d.dataset.key](c); fillDemo(d, c); });\n      lensAll(f.el);")
# the slots, the gallery's count and the glass's lens, as WorkClient does them
helpers = r'''
  // ---- the pieces' slots, as WorkClient fills them (work-client.tsx) ----
  const DM = { website: { title: 'Our day, in', titleNamed: '{name} — our day, in', month: 8, date: 25 },
    yearOn: { line: 'Your day, a year later.', lineNamed: '{name}, your day, a year later.' },
    portfolio: { titleNamed: 'Works by {name}' }, exhibition: { open: 'Open since {time}' },
    invitation: { kickerNamed: 'Dear {name}', date: '{weekday}, the {ordinal} of {month}' }, guide: { titleNamed: '{name}, tonight' },
    thanks: { titleNamed: 'Thank you for coming, {name}.' },
    gallery: { newest: 'Just now · {where}', places: ['Table 4', 'The terrace', 'Table 2', 'By the fountain', 'Table 7', 'The dance floor'] } };
  function fillDemo(d, c) {
    const set = (slot, t) => d.querySelectorAll(`[data-slot="${slot}"]`).forEach(e => { e.textContent = t; });
    const dd = now.getDate(), ordn = dd + (dd % 10 === 1 && dd !== 11 ? 'st' : dd % 10 === 2 && dd !== 12 ? 'nd' : dd % 10 === 3 && dd !== 13 ? 'rd' : 'th');
    set('time', c.hhmm);
    const y = now.getFullYear(), day0 = new Date(y, DM.website.month - 1, DM.website.date, 16), day = day0 > now ? day0 : new Date(y + 1, DM.website.month - 1, DM.website.date, 16);
    set('wedding-date', `${day.toLocaleDateString('en-GB', { weekday: 'long' })}, ${day.getDate()} ${day.toLocaleDateString('en-GB', { month: 'long' })}`);
    const left = Math.ceil((day - Date.now()) / 6e4); [Math.floor(left / 1440), Math.floor(left / 60) % 24, left % 60].forEach((v, i) => set(`countdown-${i}`, pad(v)));
    set('year-on', `${dd} ${c.month} ${y + 1}`);
    set('open-since', DM.exhibition.open.replace('{time}', c.hhmm));
    set('long-date', DM.invitation.date.replace('{weekday}', c.weekday).replace('{ordinal}', ordn).replace('{month}', c.month));
    d.querySelectorAll('[data-slot="year"]').forEach(e => { e.textContent = String(y - Number(e.dataset.back || 0)); });
    d.querySelectorAll('[data-slot="guide-time"]').forEach(e => { const off = Number(e.dataset.offset || 0); e.textContent = off === 0 ? c.hhmm : `${pad((c.h + off + 24) % 24)}:00`; });
    if (c.name) {
      set('website-title', DM.website.titleNamed.replace('{name}', c.name)); set('year-on-line', DM.yearOn.lineNamed.replace('{name}', c.name));
      set('portfolio-title', DM.portfolio.titleNamed.replace('{name}', c.name)); set('invitation-kicker', DM.invitation.kickerNamed.replace('{name}', c.name));
      set('guide-title', DM.guide.titleNamed.replace('{name}', c.name)); set('thanks', DM.thanks.titleNamed.replace('{name}', c.name));
    } else set('website-title', DM.website.title);
    gallery(d, d.classList.contains('on'));
  }
  // the live gallery: the photographs arrive one by one, the count rising with them (650 ms, then one each 320 ms)
  function gallery(d, on) {
    const count = d.querySelector('[data-slot="gallery-count"]'), newest = d.querySelector('[data-slot="gallery-newest"]');
    if (!count || !newest) return;
    (d._ticks || []).forEach(clearTimeout); d._ticks = []; count.textContent = '0'; newest.textContent = '';
    if (!on) return;
    if (d.closest('.static')) { count.textContent = '6'; newest.textContent = DM.gallery.newest.replace('{where}', DM.gallery.places[5]); return; }
    DM.gallery.places.forEach((where, i) => d._ticks.push(setTimeout(() => { count.textContent = String(i + 1); newest.textContent = DM.gallery.newest.replace('{where}', where); }, 650 + i * 320)));
  }
  // the glass's lens (lib/lens.ts), where backdrop-filter takes a url() (Chromium): its rim scaled with the frame
  const lensOK = CSS.supports('backdrop-filter', 'url(#x) blur(1px)');
  let lensN = 0;
  function lensMap(w, h, radius, E) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); if (!g) return '';
    const im = g.createImageData(w, h), r = Math.min(Math.max(radius, E), h / 2);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const vx = x + .5 - Math.min(Math.max(x + .5, r), w - r), vy = y + .5 - Math.min(Math.max(y + .5, r), h - r), len = Math.hypot(vx, vy) || 1, dd = r - len;
      const k = dd < E ? ((E - Math.max(dd, 0)) / E) ** 2 : 0, i = (y * w + x) * 4;
      im.data[i] = 128 + 127 * (vx / len) * k * .9; im.data[i + 1] = 128 + 127 * (vy / len) * k * .9; im.data[i + 2] = 128; im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0); return cv.toDataURL();
  }
  function lensAll(frame) {
    if (!lensOK) return;
    requestAnimationFrame(() => frame.querySelectorAll('.dm-glass').forEach(el => {
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight); if (!w || !h) return;
      const scale = frame.clientWidth / (frame.classList.contains('phone') ? 390 : 1440);
      const id = el.dataset.lensId || (el.dataset.lensId = 'sbl' + (++lensN));
      let svg = document.getElementById('sb-lenses');
      if (!svg) { svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.id = 'sb-lenses'; svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute'; document.body.appendChild(svg); }
      let fl = document.getElementById(id);
      if (!fl) { fl = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); fl.id = id; ['x', 'y'].forEach(a => fl.setAttribute(a, '0')); fl.setAttribute('filterUnits', 'userSpaceOnUse'); fl.setAttribute('width', '1000'); fl.setAttribute('height', '1000'); fl.setAttribute('color-interpolation-filters', 'sRGB');
        fl.innerHTML = '<feImage x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="30" xChannelSelector="R" yChannelSelector="G"/>'; svg.appendChild(fl); }
      const img = fl.querySelector('feImage'), E = Math.max(3, 14 * scale);
      img.setAttribute('href', lensMap(w, h, parseFloat(getComputedStyle(el).borderTopLeftRadius) || h / 2, E)); img.setAttribute('width', w); img.setAttribute('height', h);
      fl.querySelector('feDisplacementMap').setAttribute('scale', String(Math.round(30 * scale)));
      el.style.backdropFilter = `url(#${id}) blur(var(--blur)) saturate(1.6) brightness(1.04) contrast(1.04)`;
    }));
  }
'''
rep("  const sketch = `<div class=\"sk-bar\">", helpers + "  const sketch = `<div class=\"sk-bar\">")
# a piece that comes on starts its gallery; one that leaves stops it
rep("stack.querySelectorAll('.dm').forEach((d, j) => d.classList.toggle('on', !!demo && j === m));",
    "stack.querySelectorAll('.dm').forEach((d, j) => { const on = !!demo && j === m; if (on !== d.classList.contains('on')) { d.classList.toggle('on', on); gallery(d, on); } });")
open(p, 'w', encoding='utf-8').write(s)
print('ok', {k: len(v) for k, v in demos.items()})
