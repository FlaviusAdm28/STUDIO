import CoreGraphics
import Foundation
let l = (CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as NSArray?) as? [[String: Any]] ?? []
for w in l { let o = w["kCGWindowOwnerName"] as? String ?? ""; if o.contains("Device") || o.contains("Simul") { print(o, w["kCGWindowNumber"]!, w["kCGWindowBounds"]!) } }
