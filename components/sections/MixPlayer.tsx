'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import {
  MUSIC_PLATFORM_ICON, MUSIC_PLATFORM_HEX, MUSIC_PLATFORM_LABEL,
  detectEmbeddablePlatform, toEmbedUrl, embedHeight,
  type EmbeddableMusicPlatform as Platform,
} from '@/lib/music-platforms'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

function PlatformBadge({ platform }: { platform: Platform }) {
  const Icon = MUSIC_PLATFORM_ICON[platform]
  const hex  = MUSIC_PLATFORM_HEX[platform]

  return (
    <span
      className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: `${hex}1a`, color: hex, border: `1px solid ${hex}33` }}
    >
      <Icon size={12} />
      {MUSIC_PLATFORM_LABEL[platform]}
    </span>
  )
}

export default function MixPlayer() {
  const { t }   = useLanguage()
  const { mix } = useDjData()

  const validMixes = mix.urls
    .filter(Boolean)
    .map(url => ({ url, platform: detectEmbeddablePlatform(url) }))
    .filter((m): m is { url: string; platform: Platform } => m.platform !== null)

  if (validMixes.length === 0) return null

  return (
    <section id="mix" className="py-24 md:py-32" style={{ background: '#07070f' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <SectionHeading overline={t.mix.overline} title={t.mix.title} />
        </AnimatedSection>

        <div className="flex flex-col gap-6">
          {validMixes.map(({ url, platform }, i) => (
            <AnimatedSection key={url} delay={i * 0.1}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <PlatformBadge platform={platform} />
                </div>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <iframe
                    src={toEmbedUrl(url, platform)}
                    width="100%"
                    height={embedHeight(platform)}
                    allow="autoplay"
                    style={{ display: 'block' }}
                    title={`Mix ${i + 1}`}
                  />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
