// stroke x y file: posts real trackpad wheel events at (x, y) from a file of lines "dt_ms dy phase" (phase b|c|e = finger began/changed/ended,
// mb|mc|me = momentum began/changed/ended); dy > 0 scrolls down. Replays recorded strokes or generated profiles.
import Foundation
import CoreGraphics
let a = CommandLine.arguments
let p = CGPoint(x: Double(a[1])!, y: Double(a[2])!)
let lines = try! String(contentsOfFile: a[3], encoding: .utf8).split(separator: "\n")
CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
usleep(50000)
for l in lines {
  let f = l.split(separator: " ")
  if f.count < 3 { continue }
  let dt = Double(f[0])!, dy = Double(f[1])!, ph = String(f[2])
  if dt > 0 { usleep(UInt32(dt * 1000)) }
  guard let e = CGEvent(scrollWheelEvent2Source: nil, units: .pixel, wheelCount: 1, wheel1: Int32(-dy), wheel2: 0, wheel3: 0) else { continue }
  e.setIntegerValueField(.scrollWheelEventIsContinuous, value: 1)
  let phase: Int64 = ph == "b" ? 1 : ph == "c" ? 2 : ph == "e" ? 4 : 0
  let mom: Int64 = ph == "mb" ? 1 : ph == "mc" ? 2 : ph == "me" ? 3 : 0
  e.setIntegerValueField(.scrollWheelEventScrollPhase, value: phase)
  e.setIntegerValueField(.scrollWheelEventMomentumPhase, value: mom)
  e.location = p
  e.post(tap: .cghidEventTap)
}
