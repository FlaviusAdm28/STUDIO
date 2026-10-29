import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const asArray = (config) => (Array.isArray(config) ? config : [config])

const config = [
  // media-src/ is git-ignored (masters and the storyboards' local tools), not part of the site (28/10: its .cjs tools broke lint)
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'media-src/**'] },
  ...asArray(coreWebVitals),
  ...asArray(typescript),
]

export default config
