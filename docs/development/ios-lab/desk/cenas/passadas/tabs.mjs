// read-only: the state of each localhost:3100 tab in a Chrome (CDP port arg)
const port = process.argv[2] || 9223
const list = await (await fetch(`http://localhost:${port}/json/list`)).json()
for (const t of list.filter((t) => t.type === 'page' && t.url.includes('localhost:3100'))) {
  const ws = new WebSocket(t.webSocketDebuggerUrl)
  await new Promise((r) => (ws.onopen = r))
  const r = await new Promise((ok) => {
    ws.onmessage = (e) => ok(JSON.parse(e.data))
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { returnByValue: true, expression: `(()=>{let ss=null;try{ss=sessionStorage.getItem('v5-cenas')}catch{};const R=document.documentElement;return {url:location.href, ss, cenas:R.dataset.cenas!==undefined, vis:document.visibilityState, focus:document.hasFocus(), y:Math.round(scrollY), age:Math.round(performance.now()/1000), mp:document.getElementById('method')?.dataset.phase, cur:window.__cenas?.current?.()??null}})()` } }))
  })
  console.log(JSON.stringify(r.result?.result?.value))
  ws.close()
}
