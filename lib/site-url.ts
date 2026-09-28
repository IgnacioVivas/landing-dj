// Can't build these from headers() — NextAuth normalizes the request origin
// to AUTH_URL during the subdomain rewrite in proxy.ts, so headers() would
// report the platform's own domain instead of the actual public hostname.
// The canonical public URL is always derived directly from NEXT_PUBLIC_DOMAIN.

export function djOrigin(slug: string): string | null {
  const domain = process.env.NEXT_PUBLIC_DOMAIN
  return domain ? `https://${slug}.${domain}` : null
}

export function apexOrigin(): string | null {
  const domain = process.env.NEXT_PUBLIC_DOMAIN
  return domain ? `https://${domain}` : null
}
