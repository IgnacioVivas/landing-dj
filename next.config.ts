import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Next.js 16 caps request bodies passing through proxy.ts at 10MB by default,
    // which silently truncated video uploads (nginx already allows up to 200MB).
    proxyClientMaxBodySize: '200mb',
  },
}

export default nextConfig
