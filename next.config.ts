import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  // From 16.3 `next dev` writes its own rules into CLAUDE.md under an agent; CLAUDE.md is the project's notes only.
  agentRules: false,
  // Next 16 treats 127.0.0.1 and localhost as different origins in dev: without both, a page opened on one never hydrates.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
}

export default nextConfig
