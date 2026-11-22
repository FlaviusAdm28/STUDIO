// a bare proxy to the site (3100) for Safari's bar: no HUD; with ?strip in the address, a hidden fixed strip (z-index -1, 24 px) is put in
// the page, magenta (or ?strip=edge: the page's own edge colour, followed every frame)
import http from 'node:http'
const STRIP = `<script>(()=>{const q=new URLSearchParams(location.search);if(q.has('day')){const RD=Date;const off=new RD(new RD().toDateString()+' 14:00').getTime()-RD.now();class D extends RD{constructor(...a){if(a.length===0)super(RD.now()+off);else super(...a)}static now(){return RD.now()+off}}window.Date=D}if(q.has('noisl')){const st=document.createElement('style');st.textContent='.bar{display:none!important}';document.head.append(st)}if(q.has('hide')){const st=document.createElement('style');st.textContent=q.get('hide')+'{display:none!important}';document.head.append(st)}if(q.has('dbg')){setInterval(()=>{const r=document.documentElement;const m=document.getElementById('method'),a=document.getElementById('about');document.title=[r.style.backgroundColor,r.dataset.section,m&&m.dataset.edge,m&&m.dataset.mix,a&&a.dataset.edge,'cRun' in r.dataset?'run':''].join('|')},100)}if(q.has('nudge')){const strip=document.createElement('div');strip.style.cssText='position:fixed;top:0;left:0;right:0;height:1px;pointer-events:none;z-index:2147483646;background:rgba(0,0,0,0)';addEventListener('DOMContentLoaded',()=>document.body.append(strip));
addEventListener('keydown',(e)=>{const r=document.documentElement;const k=e.key;if(!['1','2','3','4'].includes(k))return;e.preventDefault();e.stopImmediatePropagation();
if(k==='1'){const c=r.style.backgroundColor;r.style.backgroundColor='rgb(1,2,3)';requestAnimationFrame(()=>{r.style.backgroundColor=c})}
if(k==='2'){scrollBy(0,1);requestAnimationFrame(()=>scrollBy(0,-1))}
if(k==='3'){strip.style.background='rgba(0,0,0,0.01)';requestAnimationFrame(()=>requestAnimationFrame(()=>{strip.style.background='rgba(0,0,0,0)'}))}
if(k==='4'){r.style.backgroundColor=r.style.backgroundColor}},true)}
if(q.has('hidekeys')){const sel=q.get('hidekeys')==='top'?{'5':'#top video','6':'#top','7':'#top .e-film','8':'.bar','9':'body > *:not(#top):not(script)'}:{'5':'.c-room','6':'.q-dim','7':'.contact','8':'.about .a-stage','9':'.q-box'};addEventListener('keydown',(e)=>{if(e.key==='0'){e.preventDefault();e.stopImmediatePropagation();document.querySelector('.about .a-stage').style.setProperty('clip-path','inset(0 0 100% 0)','important');return}if(e.key==='-'){e.preventDefault();e.stopImmediatePropagation();document.querySelector('.about .a-stage').style.setProperty('visibility','hidden','important');return}const s=sel[e.key];if(!s)return;e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll(s).forEach((el)=>el.style.setProperty('display','none','important'))},true)}if(q.has('feedwatch')){let worst=-1e9,n=0;const f=()=>{const e=document.getElementById('c1-feed');if(e){const b=e.getBoundingClientRect().bottom;n++;if(b>worst)worst=b}document.title='feed bottom max '+Math.round(worst*10)/10+' over '+n+' frames, scrollY '+Math.round(scrollY);requestAnimationFrame(f)};requestAnimationFrame(f)}if(!q.has('strip'))return;const s=document.createElement('div');
s.style.cssText='position:fixed;top:0;left:0;right:0;height:24px;z-index:'+(q.get('z')??'-1')+';pointer-events:none;background:#ff00ff';
addEventListener('DOMContentLoaded',()=>document.body.prepend(s));
if(q.get('strip')==='edge'){const f=()=>{s.style.backgroundColor=getComputedStyle(document.documentElement).backgroundColor;requestAnimationFrame(f)};requestAnimationFrame(f)}})()</script>`
http.createServer((req, res) => {
  const up = http.request({ host: '127.0.0.1', port: 3100, path: req.url, method: req.method, headers: { ...req.headers, host: 'localhost:3100', 'accept-encoding': 'identity' } }, (r) => {
    const html = (r.headers['content-type'] || '').includes('text/html')
    if (!html) { res.writeHead(r.statusCode, r.headers); return r.pipe(res) }
    const chunks = []
    r.on('data', (c) => chunks.push(c))
    r.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8').replace('<head>', '<head>' + STRIP)
      const h = { ...r.headers }; delete h['content-length']
      res.writeHead(r.statusCode, h); res.end(body)
    })
  })
  req.pipe(up)
}).listen(3147, '127.0.0.1')
