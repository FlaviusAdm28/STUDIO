// the wheel events as the page got them: inter-arrival gaps ≥ 20 ms inside a stroke (coalescing), and the detector's verdicts on them
import { readFileSync } from 'node:fs'
const { R } = JSON.parse(readFileSync(process.argv[2] + '/rec.json', 'utf8'))
const w = R.w
const hist = {}
for (let i = 1; i < w.length; i++) {
  const dt = w[i][0] - w[i - 1][0]
  if (dt > 200) continue
  const b = dt < 12 ? '<12' : dt < 20 ? '12-19' : dt < 30 ? '20-29' : dt < 50 ? '30-49' : '50+'
  hist[b] = (hist[b] || 0) + 1
  if (dt >= 20) console.log(String(w[i][0]).padStart(7), `dt ${dt} ostime-dt ${w[i][4] - w[i - 1][4]}`, 'values', w.slice(i - 3, i + 3).map((x) => x[1]).join(' '))
}
console.log(hist)
