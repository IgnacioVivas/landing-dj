'use client'

import type { CSSProperties } from 'react'
import { useDjData } from '@/lib/dj-context'

// Fixed full-page background image behind every section (the Hero keeps
// managing its own image/video separately). Uses position: fixed rather
// than background-attachment: fixed, which is smoother on mobile Safari.
// Slightly oversized (-inset-4) so the blur filter doesn't leave a sharp
// unblurred edge right at the viewport border.
//
// html/body have overflow-x: hidden (app/globals.css) to stop stray
// horizontal scroll from other sections — but that combination is a known
// iOS Safari bug: position: fixed elements can fail to stay put (or not
// render at all) unless forced onto their own compositing layer. translateZ
// forces that layer without touching the global overflow rule.
const FIXED_LAYER_STYLE: CSSProperties = { transform: 'translateZ(0)' }

export default function PageBackground() {
  const { theme } = useDjData()
  const { pageBackgroundUrl, pageBackgroundOverlayOpacity, pageBackgroundBlur } = theme

  if (!pageBackgroundUrl) return null

  return (
    <>
      <div
        className="fixed -inset-4 -z-20 bg-cover bg-center"
        style={{
          ...FIXED_LAYER_STYLE,
          backgroundImage: `url(${pageBackgroundUrl})`,
          filter: pageBackgroundBlur > 0 ? `blur(${pageBackgroundBlur}px)` : undefined,
        }}
      />
      {pageBackgroundOverlayOpacity > 0 && (
        <div
          className="fixed inset-0 -z-10"
          style={{ ...FIXED_LAYER_STYLE, background: `rgba(0,0,0,${pageBackgroundOverlayOpacity / 100})` }}
        />
      )}
    </>
  )
}
