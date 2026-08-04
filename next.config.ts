import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* The dev badge sits in the frame. Nothing uninvited belongs in the composition. */
  devIndicators: false,
}

export default nextConfig
