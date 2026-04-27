'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowsOut } from '@phosphor-icons/react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { GalleryItem } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

const aspectMap = {
  portrait:  'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square:    'aspect-[1/1]',
}

function GalleryCard({ item, onOpen }: { item: GalleryItem; onOpen: (item: GalleryItem) => void }) {
  const { lang } = useLanguage()
  const caption = lang === 'en' ? (item.captionEn || item.caption) : item.caption

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-pointer group ${aspectMap[item.aspect]}`}
      onClick={() => onOpen(item)}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={caption}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ background: item.gradient }}
        />
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 flex flex-col items-center justify-center gap-2">
        <ArrowsOut size={22} className="text-white" />
        {caption && (
          <p className="font-mono text-xs text-white/80 tracking-wider text-center px-4">
            {caption}
          </p>
        )}
      </div>
      <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none" />
    </motion.div>
  )
}

function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const { lang } = useLanguage()
  const caption = lang === 'en' ? (item.captionEn || item.caption) : item.caption

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`w-full relative ${aspectMap[item.aspect]}`}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.caption}
                fill
                className="object-cover"
                sizes="672px"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: item.gradient }} />
            )}
          </div>
          {caption && (
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-body text-sm text-white">{caption}</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Multimedia() {
  const { t } = useLanguage()
  const { gallery } = useDjData()
  const [active, setActive] = useState<GalleryItem | null>(null)

  if (!gallery.length) return null

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

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {gallery.map((item) => (
            <GalleryCard key={item.id} item={item} onOpen={setActive} />
          ))}
        </div>
      </div>

      {active && <Lightbox item={active} onClose={() => setActive(null)} />}
    </section>
  )
}
