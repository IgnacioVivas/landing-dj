'use client'

import { CalendarBlank, MapPin, Ticket } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import type { Show } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ShowsFlyer from './ShowsFlyer'

function formatDate(iso: string, locale: string) {
  const date = new Date(iso)
  return {
    day:   date.toLocaleDateString(locale, { day: '2-digit' }),
    month: date.toLocaleDateString(locale, { month: 'short' }).toUpperCase(),
    year:  date.getFullYear(),
  }
}

function ShowRow({ show, index, past }: { show: Show; index: number; past?: boolean }) {
  const { lang, t } = useLanguage()
  const locale = lang === 'es' ? 'es-AR' : 'en-US'
  const d = formatDate(show.date, locale)

  return (
    <AnimatedSection delay={index * 0.06} direction="left" className={past ? 'opacity-40' : ''}>
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 rounded-xl group transition-colors duration-200 hover:bg-white/[0.03]"
        style={{ borderBottom: '1px solid var(--dj-border)' }}
      >
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="w-14 text-center">
            <p className="font-display text-3xl text-white leading-none">{d.day}</p>
            <p className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--dj-accent)' }}>{d.month}</p>
            <p className="font-mono text-[10px] text-slate-700">{d.year}</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-body font-semibold text-white text-base">{show.venue}</span>
            {show.festival && (
              <span
                className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full"
                style={{ color: 'var(--dj-accent)', border: '1px solid color-mix(in srgb, var(--dj-accent) 30%, transparent)' }}
              >
                {show.festival}
              </span>
            )}
            {show.isSoldOut && (
              <span className="font-mono text-[10px] tracking-wider text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                {t.shows.soldOut}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 mt-1 font-mono text-xs text-slate-500">
            <MapPin size={12} />
            {show.city}, {show.country}
          </p>
        </div>

        {show.ticketUrl && !past && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 font-body text-sm font-medium text-slate-400 transition-colors"
            style={{ '--tw-hover-color': 'var(--dj-accent)' } as React.CSSProperties}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--dj-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = '')}
          >
            <Ticket size={16} />
            {t.shows.tickets}
          </a>
        )}
      </div>
    </AnimatedSection>
  )
}

function ShowsList({ upcoming, past }: { upcoming: Show[]; past: Show[] }) {
  const { t } = useLanguage()
  return (
    <>
      <div className="mb-16">
        <AnimatedSection>
          <p className="font-mono text-xs tracking-widest text-slate-600 uppercase mb-4 flex items-center gap-2">
            <CalendarBlank size={12} />
            {t.shows.upcoming}
          </p>
        </AnimatedSection>
        <div className="space-y-1">
          {upcoming.map((show, i) => <ShowRow key={show.id} show={show} index={i} />)}
        </div>
      </div>

      {past.length > 0 && (
        <div>
          <AnimatedSection>
            <p className="font-mono text-xs tracking-widest text-slate-700 uppercase mb-4 flex items-center gap-2">
              <CalendarBlank size={12} />
              {t.shows.past}
            </p>
          </AnimatedSection>
          <div className="space-y-1">
            {past.map((show, i) => <ShowRow key={show.id} show={show} index={i} past />)}
          </div>
        </div>
      )}
    </>
  )
}

export default function Shows() {
  const { t } = useLanguage()
  const { shows, showsMode } = useDjData()
  const upcoming = shows.filter(s => !s.isPast)
  const past     = shows.filter(s => s.isPast)

  if (!shows.length) return null

  return (
    <section id="shows" className="py-24 md:py-32 bg-[#07070f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading overline={t.shows.overline} title={t.shows.title} />
        </div>

        {showsMode === 'flyer'
          ? <ShowsFlyer upcoming={upcoming} past={past} />
          : <ShowsList upcoming={upcoming} past={past} />
        }
      </div>
    </section>
  )
}
