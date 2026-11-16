import ApplicationServices
let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
print(AXIsProcessTrustedWithOptions(opts) ? "trusted" : "NOT trusted (macOS was asked to show the prompt naming the app)")
