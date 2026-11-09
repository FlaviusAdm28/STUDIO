// wheel.swift x y notches interval-ms [pad dy n]: a physical mouse wheel — line events, not continuous, no phases (notches > 0 scroll down)
// or, with "pad", one trackpad stroke as simtouch.swift posts it
import Foundation
import CoreGraphics
let a = CommandLine.arguments.dropFirst().map { $0 }
let p = CGPoint(x: Double(a[0])!, y: Double(a[1])!)
CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
usleep(50000)
if a.count > 2 && a[2] == "click" {
  CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
  usleep(60000)
  CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
} else if a.count > 4 && a[4] == "pad" {
  let dy = Double(a[2])!, n = Int(a[3])!
  func ev(_ d: Double, phase: Int64, momentum: Int64) {
    guard let e = CGEvent(scrollWheelEvent2Source: nil, units: .pixel, wheelCount: 1, wheel1: Int32(-d), wheel2: 0, wheel3: 0) else { return }
    e.setIntegerValueField(.scrollWheelEventIsContinuous, value: 1)
    e.setIntegerValueField(.scrollWheelEventScrollPhase, value: phase)
    e.setIntegerValueField(.scrollWheelEventMomentumPhase, value: momentum)
    e.location = p
    e.post(tap: .cghidEventTap)
  }
  let per = dy / Double(n)
  ev(0, phase: 1, momentum: 0); usleep(8000)
  for _ in 0..<n { ev(per, phase: 2, momentum: 0); usleep(8000) }
  ev(0, phase: 4, momentum: 0); usleep(8000)
  var v = per
  ev(v, phase: 0, momentum: 1); usleep(16000)
  while abs(v) > 1 { v *= 0.9; ev(v, phase: 0, momentum: 2); usleep(16000) }
  ev(0, phase: 0, momentum: 3)
} else {
  let notches = Int(a[2])!, gap = UInt32(Double(a[3])! * 1000)
  for _ in 0..<abs(notches) {
    guard let e = CGEvent(scrollWheelEvent2Source: nil, units: .line, wheelCount: 1, wheel1: notches > 0 ? -1 : 1, wheel2: 0, wheel3: 0) else { break }
    e.location = p
    e.post(tap: .cghidEventTap)
    usleep(gap)
  }
}
