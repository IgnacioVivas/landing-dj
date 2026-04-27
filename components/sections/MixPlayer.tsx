'use client'

import { SoundcloudLogo, SpotifyLogo } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

type Platform = 'soundcloud' | 'spotify' | 'mixcloud'

function detectPlatform(url: string): Platform | null {
  if (url.includes('soundcloud.com'))   return 'soundcloud'
  if (url.includes('open.spotify.com')) return 'spotify'
  if (url.includes('mixcloud.com'))     return 'mixcloud'
  return null
}

function toEmbedUrl(url: string, platform: Platform): string {
  if (platform === 'soundcloud') {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&visual=true&hide_related=true&show_comments=false&show_user=true`
  }
  if (platform === 'spotify') {
    const [base] = url.split('?')
    // strip locale prefix like /intl-es/, /intl-en/, etc.
    const clean = base.replace(/open\.spotify\.com\/intl-[a-z]+\//, 'open.spotify.com/')
    return clean.replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator&theme=0'
  }
  // mixcloud
  const path = url.replace(/^https?:\/\/(www\.)?mixcloud\.com/, '')
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(path)}`
}

function PlatformBadge({ platform }: { platform: Platform }) {
  if (platform === 'soundcloud') {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(255,85,0,0.1)', color: '#ff5500', border: '1px solid rgba(255,85,0,0.2)' }}>
        <SoundcloudLogo size={12} />
        SoundCloud
      </span>
    )
  }
  if (platform === 'spotify') {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(30,215,96,0.1)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.2)' }}>
        <SpotifyLogo size={12} />
        Spotify
      </span>
    )
  }
  return (
    <span className="font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: 'rgba(82,134,226,0.1)', color: '#5286e2', border: '1px solid rgba(82,134,226,0.2)' }}>
      Mixcloud
    </span>
  )
}

export default function MixPlayer() {
  const { t }  = useLanguage()
  const { mix } = useDjData()

  if (!mix.url) return null

  const platform = detectPlatform(mix.url)
  if (!platform) return null

  const embedUrl = toEmbedUrl(mix.url, platform)
  const height   = platform === 'soundcloud' ? 166 : platform === 'spotify' ? 152 : 120

  return (
    <section id="mix" className="py-24 md:py-32" style={{ background: '#07070f' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          <SectionHeading overline={t.mix.overline} title={t.mix.title} />
          <PlatformBadge platform={platform} />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height={height}
              allow="autoplay"
              style={{ display: 'block' }}
              title="Mix player"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
