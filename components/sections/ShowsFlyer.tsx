'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { MapPin, Ticket } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Show } from '@/lib/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

function FlyerCard({ show, index, past }: { show: Show; index: number; past?: boolean }) {
  const { lang, t } = useLanguage()
  const locale = lang === 'es' ? 'es-AR' : 'en-US'
  const date = new Date(show.date)
  const day   = date.toLocaleDateString(locale, { day: '2-digit' })
  const month = date.toLocaleDateString(locale, { month: 'short' }).toUpperCase()
  const year  = date.getFullYear()

  return (
    <AnimatedSection delay={index * 0.05}>
      <motion.div
        className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-default group ${past ? 'opacity-40' : ''}`}
        whileHover={past ? {} : { scale: 1.02, y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background: flyer image or gradient */}
        {show.flyerUrl ? (
          <Image
            src={show.flyerUrl}
            alt={`${show.venue} flyer`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg,
                color-mix(in srgb, var(--dj-accent) 30%, #050509) 0%,
                #050509 60%,
                color-mix(in srgb, var(--dj-accent2) 15%, #050509) 100%
              )`,
            }}
          />
        )}

        {/* Dark overlay gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Accent ring */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--dj-accent) 50%, transparent)' }}
        />

        {/* Date badge (top-left, no flyer) or always for text poster */}
        {!show.flyerUrl && (
          <div className="absolute top-5 left-5 text-center">
            <p className="font-display text-5xl text-white leading-none">{day}</p>
            <p className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--dj-accent)' }}>{month}</p>
            <p className="font-mono text-xs text-slate-500">{year}</p>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-1">
          {show.flyerUrl && (
            <p className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--dj-accent)' }}>
              {day} {month} {year}
            </p>
          )}
          <p className="font-body font-semibold text-white text-sm leading-tight">{show.venue}</p>
          <p className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <MapPin size={10} />
            {show.city}, {show.country}
          </p>

          <div className="flex items-center gap-2 mt-1">
            {show.festival && (
              <span
                className="font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ color: 'var(--dj-accent)', border: '1px solid color-mix(in srgb, var(--dj-accent) 30%, transparent)' }}
              >
                {show.festival}
              </span>
            )}
            {show.isSoldOut && (
              <span className="font-mono text-[9px] tracking-wider text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                {t.shows.soldOut}
              </span>
            )}
            {show.ticketUrl && !past && (
              <a
                href={show.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 font-mono text-[9px] text-slate-300 hover:text-white transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Ticket size={10} />
                {t.shows.tickets}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  )
}

export default function ShowsFlyer({ upcoming, past }: { upcoming: Show[]; past: Show[] }) {
  const { t } = useLanguage()
  return (
    <>
      {upcoming.length > 0 && (
        <div className="mb-16">
          <AnimatedSection>
            <p className="font-mono text-xs tracking-widest text-slate-600 uppercase mb-6">{t.shows.upcoming}</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {upcoming.map((show, i) => <FlyerCard key={show.id} show={show} index={i} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <AnimatedSection>
            <p className="font-mono text-xs tracking-widest text-slate-700 uppercase mb-6">{t.shows.past}</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {past.map((show, i) => <FlyerCard key={show.id} show={show} index={i} past />)}
          </div>
        </div>
      )}
    </>
  )
}
