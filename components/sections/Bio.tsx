'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Bio() {
  const { t, lang } = useLanguage()
  const dj = useDjData()
  const { bio } = dj
  const [expanded, setExpanded] = useState(false)

  const displayShort = lang === 'en' ? (bio.shortEn || bio.short) : bio.short
  const displayFull  = lang === 'en' ? (bio.fullEn  || bio.full)  : bio.full

  return (
    <section id="bio" className="py-24 md:py-32 bg-[#07070f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <AnimatedSection direction="left">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden max-w-md mx-auto lg:mx-0">
              {bio.photoUrl ? (
                <Image
                  src={bio.photoUrl}
                  alt={dj.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(160deg, #0d0221 0%, #1a0050 40%, #2d0080 70%, #3a00a0 100%)' }}
                  />
                  <div className="absolute inset-0 flex items-end p-6">
                    <span className="font-display text-4xl text-white/10 select-none">{dj.name}</span>
                  </div>
                </>
              )}
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--dj-accent) 20%, transparent)' }} />
            </div>
          </AnimatedSection>

          {/* Text */}
          <div className="flex flex-col gap-8">
            <SectionHeading overline={t.bio.overline} title={t.bio.title} />

            <AnimatedSection delay={0.1}>
              <div>
                <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed">
                  {displayShort || t.bio.text}
                </p>

                {displayFull && (
                  <>
                    {expanded && (
                      <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed mt-4">
                        {displayFull}
                      </p>
                    )}
                    <button
                      onClick={() => setExpanded(v => !v)}
                      className="mt-3 font-mono text-xs transition-colors"
                      style={{ color: 'var(--dj-accent)' }}
                    >
                      {lang === 'en'
                        ? (expanded ? 'Read less ↑' : 'Read more ↓')
                        : (expanded ? 'Leer menos ↑' : 'Leer más ↓')}
                    </button>
                  </>
                )}
              </div>
            </AnimatedSection>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
              {bio.stats.map((stat, i) => (
                <AnimatedSection key={i} delay={0.15 + i * 0.07}>
                  <div
                    className="flex flex-col gap-1 p-4 rounded-xl"
                    style={{ background: 'var(--dj-surface)', border: '1px solid var(--dj-border)' }}
                  >
                    <span className="font-display text-3xl leading-none" style={{ color: 'var(--dj-accent)' }}>
                      {stat.value}
                    </span>
                    <span className="font-mono text-xs text-slate-500 tracking-wider uppercase">
                      {t.bio.statLabels[i] ?? stat.label}
                    </span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
