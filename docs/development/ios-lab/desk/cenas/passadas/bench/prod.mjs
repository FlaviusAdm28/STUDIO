// the site's own detector (src/lib/strokes.ts), transpiled as it is, wrapped like det.mjs's make
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
const ROOT = fileURLToPath(new URL('../../../../../../../', import.meta.url))
const require = createRequire(`${ROOT}package.json`)
const ts = require('typescript')
const src = readFileSync(`${ROOT}src/lib/strokes.ts`, 'utf8')
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
// out of the repository: a transpiled copy, made at each run
const file = pathToFileURL(`${process.env.HOME}/.local/share/v5-lab/strokes.prod.mjs`)
writeFileSync(file, out)
const { strokeDetector } = await import(file.href + '?' + Date.now())
export const makeProd = () => {
  const d = strokeDetector()
  return (e) => d(e.ts, e.dy)
}
