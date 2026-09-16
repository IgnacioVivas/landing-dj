'use client'

import { useDjData } from '@/lib/dj-context'

// Fixed full-page background image behind every section (the Hero keeps
// managing its own image/video separately). Uses position: fixed rather
// than background-attachment: fixed, which is smoother on mobile Safari.
// Slightly oversized (-inset-4) so the blur filter doesn't leave a sharp
// unblurred edge right at the viewport border.
export default function PageBackground() {
  const { theme } = useDjData()
  const { pageBackgroundUrl, pageBackgroundOverlayOpacity, pageBackgroundBlur } = theme

  if (!pageBackgroundUrl) return null

  return (
    <>
      <div
        className="fixed -inset-4 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${pageBackgroundUrl})`,
          filter: pageBackgroundBlur > 0 ? `blur(${pageBackgroundBlur}px)` : undefined,
        }}
      />
      {pageBackgroundOverlayOpacity > 0 && (
        <div
          className="fixed inset-0 -z-10"
          style={{ background: `rgba(0,0,0,${pageBackgroundOverlayOpacity / 100})` }}
        />
      )}
    </>
  )
}
