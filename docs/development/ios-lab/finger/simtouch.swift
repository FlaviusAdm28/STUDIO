// SimTouch: posts mouse drags (= finger swipes in the iOS Simulator) read from a command file.
// cmd file lines: "drag x1 y1 x2 y2 ms [holdms]" | "click x y" | "sleep ms". Global screen points.
import Foundation
import ApplicationServices
import CoreGraphics
let dir = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "/tmp"
let cmd = dir + "/cmd.txt", res = dir + "/res.txt", log = dir + "/log.txt"
let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
let trusted = AXIsProcessTrustedWithOptions(opts)
try? "trusted=\(trusted)\n".write(toFile: log, atomically: true, encoding: .utf8)
func post(_ t: CGEventType, _ p: CGPoint) {
  CGEvent(mouseEventSource: nil, mouseType: t, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
}
func drag(_ a: CGPoint, _ b: CGPoint, _ ms: Double, _ hold: Double) {
  post(.mouseMoved, a); usleep(16000)
  post(.leftMouseDown, a); usleep(16000)
  let steps = max(2, Int(ms / 8))
  for i in 1...steps {
    let t = Double(i) / Double(steps)
    let p = CGPoint(x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t)
    post(.leftMouseDragged, p); usleep(useconds_t(ms * 1000 / Double(steps)))
  }
  if hold > 0 { usleep(useconds_t(hold * 1000)) }
  post(.leftMouseUp, b)
}
// a trackpad stroke: pixel scroll events with phases (began, changed…, ended), then momentum events easing off. dy > 0 scrolls down
func pad(_ at: CGPoint, _ dy: Double, _ n: Int) {
  post(.mouseMoved, at); usleep(30000)
  func ev(_ d: Double, phase: Int64, momentum: Int64) {
    guard let e = CGEvent(scrollWheelEvent2Source: nil, units: .pixel, wheelCount: 1, wheel1: Int32(-d), wheel2: 0, wheel3: 0) else { return }
    e.setIntegerValueField(.scrollWheelEventIsContinuous, value: 1)
    e.setIntegerValueField(.scrollWheelEventScrollPhase, value: phase)
    e.setIntegerValueField(.scrollWheelEventMomentumPhase, value: momentum)
    e.location = at
    e.post(tap: .cghidEventTap)
  }
  let per = dy / Double(n)
  ev(0, phase: 1, momentum: 0); usleep(8000)
  for _ in 0..<n { ev(per, phase: 2, momentum: 0); usleep(8000) }
  ev(0, phase: 4, momentum: 0); usleep(8000)
  var v = per * 0.9
  ev(v, phase: 0, momentum: 1); usleep(16000)
  while abs(v) > 1 { v *= 0.9; ev(v, phase: 0, momentum: 2); usleep(16000) }
  ev(0, phase: 0, momentum: 3)
}
while true {
  if let s = try? String(contentsOfFile: cmd, encoding: .utf8) {
    try? FileManager.default.removeItem(atPath: cmd)
    for line in s.split(separator: "\n") {
      let f = line.split(separator: " ").map(String.init); let n = f.dropFirst().compactMap(Double.init)
      switch f.first {
      case "drag" where n.count >= 5: drag(CGPoint(x: n[0], y: n[1]), CGPoint(x: n[2], y: n[3]), n[4], n.count > 5 ? n[5] : 0)
      case "click" where n.count >= 2: let p = CGPoint(x: n[0], y: n[1]); post(.mouseMoved, p); usleep(16000); post(.leftMouseDown, p); usleep(60000); post(.leftMouseUp, p)
      case "pad" where n.count >= 4: pad(CGPoint(x: n[0], y: n[1]), n[2], Int(n[3]))
      case "sleep" where n.count >= 1: usleep(useconds_t(n[0] * 1000))
      case "quit": exit(0)
      default: break
      }
    }
    try? "done \(Date().timeIntervalSince1970) trusted=\(AXIsProcessTrusted())\n".write(toFile: res, atomically: true, encoding: .utf8)
  }
  usleep(10000)
}
