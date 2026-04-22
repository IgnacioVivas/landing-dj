'use client'

import { motion } from 'motion/react'
import {
  SpotifyLogo,
  ApplePodcastsLogo,
  SoundcloudLogo,
  MusicNote,
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { Release } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

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
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: release.coverGradient }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
          <div className="flex gap-3">
            {release.links.spotify && (
              <a href={release.links.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <SpotifyLogo size={18} />
              </a>
            )}
            {release.links.soundcloud && (
              <a href={release.links.soundcloud} target="_blank" rel="noopener noreferrer" aria-label="SoundCloud"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <SoundcloudLogo size={18} />
              </a>
            )}
            {release.links.appleMusic && (
              <a href={release.links.appleMusic} target="_blank" rel="noopener noreferrer" aria-label="Apple Music"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ApplePodcastsLogo size={18} />
              </a>
            )}
            {release.links.beatport && (
              <a href={release.links.beatport} target="_blank" rel="noopener noreferrer" aria-label="Beatport"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <MusicNote size={18} />
              </a>
            )}
          </div>
        </div>
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-violet-400 uppercase">
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
    </motion.article>
  )
}

export default function Releases() {
  const { t } = useLanguage()
  const { releases } = useDjData()

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
