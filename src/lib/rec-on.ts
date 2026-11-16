// Is the flight recorder on (lib/rec.ts)? Only on this machine and with ?rec in the address, kept for the tab (?rec=0 ends it). Apart from
// the recorder so the page's own bundle carries only this check.
export const KEY = 'v5-rec'

export function recOn() {
  try {
    const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!local) return false
    const q = new URLSearchParams(location.search).get('rec')
    if (q === '0') sessionStorage.removeItem(KEY)
    else if (q !== null) sessionStorage.setItem(KEY, '1')
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
