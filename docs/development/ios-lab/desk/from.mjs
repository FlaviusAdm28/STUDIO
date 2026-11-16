// from.mjs <y> <stroke> <n>: place the page at y, one stroke profile, where it rested; n times
import * as D from '/Users/flaviooliveira/WebstormProjects/STUDIO/docs/development/ios-lab/desk/desk.mjs'
const [, , y, name, n = '3'] = process.argv
D.front(); await D.sleep(300)
for (let i = 0; i < +n; i++) {
  await D.place(+y); const from = await D.where()
  D.strokeFile(name); await D.sleep(6000); await D.rest()
  console.log(i, from.split(' snap')[0], '→', (await D.where()).split(' snap')[0])
}
D.close(); process.exit(0)
