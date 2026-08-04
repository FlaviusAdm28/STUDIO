import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const asArray = (config) => (Array.isArray(config) ? config : [config])

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...asArray(coreWebVitals),
  ...asArray(typescript),
]

export default config
