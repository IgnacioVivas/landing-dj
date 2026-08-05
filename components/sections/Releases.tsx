'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { Release } from '@/lib/types'
import { MUSIC_PLATFORM_ICON, MUSIC_PLATFORM_LABEL, type MusicPlatform } from '@/lib/music-platforms'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

// Mixcloud isn't a release-streaming link (only Spotify/SoundCloud/Apple Music/Beatport are)
const RELEASE_PLATFORMS: Exclude<MusicPlatform, 'mixcloud'>[] = ['spotify', 'soundcloud', 'appleMusic', 'beatport']

function ReleaseLinks({ links, className }: { links: Release['links']; className: string }) {
  const active = RELEASE_PLATFORMS.filter(platform => links[platform])
  if (!active.length) return null

  return (
    <div className={className}>
      {active.map(platform => {
        const Icon = MUSIC_PLATFORM_ICON[platform]
        return (
          <a
            key={platform}
            href={links[platform]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={MUSIC_PLATFORM_LABEL[platform]}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Icon size={18} />
          </a>
        )
      })}
    </div>
  )
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-60 group"
    >
      {/* Cover art */}
      <div className="relative w-60 h-60 rounded-xl overflow-hidden mb-4">
        {release.coverImageUrl ? (
          <Image
            src={release.coverImageUrl}
            alt={release.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="240px"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: release.coverGradient }}
          />
        )}

        {/* Desktop: links appear on hover — there's no hover on touch devices, so
            mobile gets its own always-visible row below instead (see ReleaseLinks below) */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
          <ReleaseLinks links={release.links} className="flex gap-3" />
        </div>

        {/* Decorative ring — pointer-events-none so it never blocks link clicks */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--dj-accent)' }}>
            {release.type.toUpperCase()}
          </span>
          {release.label && (
            <>
              <span className="text-slate-700">·</span>
              <span className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">
                {release.label}
              </span>
            </>
          )}
        </div>
        <h3 className="font-display text-xl text-white tracking-wide leading-none">
          {release.title}
        </h3>
        <p className="font-mono text-xs text-slate-600">{release.year}</p>
      </div>

      <ReleaseLinks links={release.links} className="flex md:hidden gap-2 mt-3" />
    </motion.article>
  )
}

export default function Releases() {
  const { t } = useLanguage()
  const { releases } = useDjData()

  if (!releases.length) return null

  return (
    <section id="releases" className="py-24 md:py-32" style={{ background: '#050509' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <SectionHeading
            overline={t.releases.overline}
            title={t.releases.title}
            description={t.releases.description}
          />
        </AnimatedSection>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {releases.map((release, i) => (
            <div key={release.id} className="snap-start">
              <ReleaseCard release={release} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
