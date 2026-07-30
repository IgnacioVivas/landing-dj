'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Play } from '@phosphor-icons/react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { GalleryItem } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CoverflowCarousel from '@/components/ui/CoverflowCarousel'

const aspectMap = {
  portrait:  'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square:    'aspect-[1/1]',
}

function InlineVideo({ item, isPlaying, onToggle }: { item: GalleryItem; isPlaying: boolean; onToggle: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // React reuses this same <video> element across renders, so toggling the
  // `autoPlay` attribute after mount does nothing — browsers only honor it
  // when the element is first attached. Drive play/pause imperatively instead.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (isPlaying) el.play().catch(() => {})
    else el.pause()
  }, [isPlaying])

  function handleEnded() {
    if (videoRef.current) videoRef.current.currentTime = 0
    onToggle()
  }

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={onToggle}>
      <video
        ref={videoRef}
        src={item.videoUrl!}
        poster={item.videoThumbnailUrl ?? undefined}
        preload="metadata"
        muted={!isPlaying}
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Play size={20} weight="fill" className="text-white ml-0.5" />
          </div>
        </div>
      )}
    </div>
  )
}

function GridCard({ item, isPlaying, onToggleVideo }: { item: GalleryItem; isPlaying: boolean; onToggleVideo: () => void }) {
  const { lang } = useLanguage()
  const caption = lang === 'en' ? (item.captionEn || item.caption) : item.caption

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative break-inside-avoid mb-4 rounded-xl overflow-hidden ${aspectMap[item.aspect]}`}
    >
      {item.videoUrl ? (
        <InlineVideo item={item} isPlaying={isPlaying} onToggle={onToggleVideo} />
      ) : item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={caption}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: item.gradient }} />
      )}
      <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none" />
    </motion.div>
  )
}

export default function Multimedia() {
  const { t }                     = useLanguage()
  const { gallery, galleryMode }  = useDjData()
  const [playingId, setPlayingId] = useState<string | null>(null)

  if (!gallery.length) return null

  const togglePlay = (id: string) => setPlayingId(p => (p === id ? null : id))

  return (
    <section id="media" className="py-24 md:py-32" style={{ background: '#050509' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <SectionHeading
            overline={t.multimedia.overline}
            title={t.multimedia.title}
            description={t.multimedia.description}
          />
        </AnimatedSection>

        {galleryMode === 'carousel' ? (
          <CoverflowCarousel items={gallery} playingId={playingId} onToggleVideo={togglePlay} />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {gallery.map(item => (
              <GridCard
                key={item.id}
                item={item}
                isPlaying={playingId === item.id}
                onToggleVideo={() => togglePlay(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
