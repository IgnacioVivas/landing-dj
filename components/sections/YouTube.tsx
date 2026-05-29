'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { YoutubeLogo, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlowButton from '@/components/ui/GlowButton'

export default function YouTube() {
  const { t }     = useLanguage()
  const { name, youtube } = useDjData()
  const { videoIds, channelUrl } = youtube
  const [current, setCurrent] = useState(0)

  if (!videoIds.length) return null

  const prev = () => setCurrent(c => (c - 1 + videoIds.length) % videoIds.length)
  const next = () => setCurrent(c => (c + 1) % videoIds.length)

  return (
    <section id="youtube" className="py-24 md:py-32 bg-[#07070f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <SectionHeading
            overline={t.youtube.overline}
            title={t.youtube.title}
            description={t.youtube.description}
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {/* Padding horizontal crea espacio para las flechas fuera del video */}
          <div className={`relative ${videoIds.length > 1 ? 'px-14' : ''}`}>
            {/* Video */}
            <div
              className="relative w-full aspect-video rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 0 80px rgba(139, 92, 246, 0.15), 0 0 20px rgba(0,0,0,0.8)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={videoIds[current]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${videoIds[current]}?rel=0&modestbranding=1`}
                    title={`${name} — video ${current + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows — fuera del video, en la zona de padding */}
            {videoIds.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 group"
                  style={{
                    background:    'rgba(255,255,255,0.07)',
                    border:        '1px solid rgba(255,255,255,0.14)',
                    backdropFilter:'blur(10px)',
                    boxShadow:     '0 4px 24px rgba(0,0,0,0.5)',
                  }}
                  aria-label="Video anterior"
                >
                  <CaretLeft size={20} weight="bold" className="text-white/70 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 group"
                  style={{
                    background:    'rgba(255,255,255,0.07)',
                    border:        '1px solid rgba(255,255,255,0.14)',
                    backdropFilter:'blur(10px)',
                    boxShadow:     '0 4px 24px rgba(0,0,0,0.5)',
                  }}
                  aria-label="Video siguiente"
                >
                  <CaretRight size={20} weight="bold" className="text-white/70 group-hover:text-white transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {videoIds.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-5">
              {videoIds.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === current ? 'var(--dj-accent)' : 'rgba(255,255,255,0.2)',
                    transform:  i === current ? 'scale(1.4)' : 'scale(1)',
                  }}
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex justify-center mt-8">
          <GlowButton href={channelUrl ?? undefined} variant="outline">
            <YoutubeLogo size={18} weight="fill" className="text-red-500" />
            {t.youtube.cta}
          </GlowButton>
        </AnimatedSection>
      </div>
    </section>
  )
}
