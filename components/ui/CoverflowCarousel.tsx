'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CaretLeft, CaretRight, Play } from '@phosphor-icons/react'
import Image from 'next/image'
import type { GalleryItem } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

const CARD_WIDTH  = 360
const CARD_HEIGHT = Math.round(CARD_WIDTH * 4 / 3) // 480px — portrait ratio

const CONFIG = {
  0: { scale: 1,    opacity: 1,    zIndex: 20 },
  1: { scale: 0.72, opacity: 0.55, zIndex: 15 },
  2: { scale: 0.52, opacity: 0.2,  zIndex: 10 },
} as const

type Props = {
  items:  GalleryItem[]
  onOpen: (item: GalleryItem) => void
}

export default function CoverflowCarousel({ items, onOpen }: Props) {
  const { lang }                 = useLanguage()
  const [current, setCurrent]    = useState(0)
  const [spacing, setSpacing]    = useState(340)
  const containerRef             = useRef<HTMLDivElement>(null)
  const touchStartX              = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      setSpacing(Math.max(180, Math.min(340, Math.floor(w * 0.26))))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)
  const next = () => setCurrent(c => (c + 1) % items.length)

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev()
    touchStartX.current = null
  }

  // Build visible slots — deduplicate when gallery has fewer than 5 items
  const visibleSlots: { item: GalleryItem; offset: number }[] = []
  const seen = new Set<string>()
  for (const offset of [-2, -1, 0, 1, 2]) {
    const idx  = (current + offset + items.length) % items.length
    const item = items[idx]
    if (!seen.has(item.id)) {
      visibleSlots.push({ item, offset })
      seen.add(item.id)
    }
  }

  const transition = { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } as const

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ height: CARD_HEIGHT + 80 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cards */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {visibleSlots.map(({ item, offset }) => {
            const abs     = Math.min(Math.abs(offset), 2) as 0 | 1 | 2
            const cfg     = CONFIG[abs]
            const x       = offset * spacing - CARD_WIDTH / 2
            const caption = lang === 'en' ? (item.captionEn || item.caption) : item.caption
            // Items enter/exit from the far side in the correct direction
            const farX    = (offset >= 0 ? 3 : -3) * spacing - CARD_WIDTH / 2

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer"
                style={{
                  width:     CARD_WIDTH,
                  left:      '50%',
                  top:       '50%',
                  marginTop: -CARD_HEIGHT / 2,
                  zIndex:    cfg.zIndex,
                }}
                initial={{ x: farX, scale: 0.45, opacity: 0 }}
                animate={{ x, scale: cfg.scale, opacity: cfg.opacity }}
                exit={{ x: farX, scale: 0.45, opacity: 0 }}
                transition={transition}
                onClick={() => offset === 0
                  ? onOpen(item)
                  : setCurrent((current + offset + items.length) % items.length)
                }
              >
                <div className="relative rounded-2xl overflow-hidden" style={{ height: CARD_HEIGHT }}>
                  {item.videoUrl ? (
                    <>
                      <div className="absolute inset-0" style={{ background: item.gradient }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play size={24} weight="fill" className="text-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={caption || ''}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes={`${CARD_WIDTH}px`}
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: item.gradient }} />
                  )}

                  {offset === 0 && caption && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/75 to-transparent">
                      <p className="font-body text-sm text-white text-center">{caption}</p>
                    </div>
                  )}

                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-slate-400 hover:text-white transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-label="Anterior"
      >
        <CaretLeft size={20} weight="bold" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-slate-400 hover:text-white transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)' }}
        aria-label="Siguiente"
      >
        <CaretRight size={20} weight="bold" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current ? 'var(--dj-accent)' : 'rgba(255,255,255,0.2)',
              transform:  i === current ? 'scale(1.4)' : 'scale(1)',
            }}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
