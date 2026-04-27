'use client'

import { useEffect, useState } from 'react'
import { MapPin } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import AnimatedSection from '@/components/ui/AnimatedSection'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 24px -8px var(--dj-accent)',
        }}
      >
        <span
          className="font-display text-3xl sm:text-4xl tabular-nums"
          style={{ color: 'var(--dj-accent)' }}
        >
          {str}
        </span>
      </div>
      <span className="font-mono text-[9px] tracking-widest text-slate-600">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const { t } = useLanguage()
  const { countdown } = useDjData()
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!countdown) return
    const target = new Date(countdown.date)
    setTime(calcTimeLeft(target))
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [countdown])

  if (!countdown || !time) return null
  if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) return null

  const dateStr = new Date(countdown.date).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <section className="py-16 md:py-20" style={{ background: '#06060d' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <p
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--dj-accent)' }}
          >
            {t.countdown.overline}
          </p>
          <p className="font-display text-2xl sm:text-3xl text-white tracking-wider">
            {countdown.venue}
            {countdown.festival && (
              <span
                className="ml-3 text-base font-body px-2 py-1 rounded-full"
                style={{ color: 'var(--dj-accent)', border: '1px solid color-mix(in srgb, var(--dj-accent) 30%, transparent)' }}
              >
                {countdown.festival}
              </span>
            )}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 font-mono text-xs text-slate-500">
            <MapPin size={12} />
            <span>{countdown.city}, {countdown.country}</span>
            <span className="text-slate-700">·</span>
            <span>{dateStr}</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="flex items-start justify-center gap-3 sm:gap-5">
          <Digit value={time.days}    label={t.countdown.days} />
          <span className="font-display text-3xl text-slate-700 mt-4">:</span>
          <Digit value={time.hours}   label={t.countdown.hours} />
          <span className="font-display text-3xl text-slate-700 mt-4">:</span>
          <Digit value={time.minutes} label={t.countdown.minutes} />
          <span className="font-display text-3xl text-slate-700 mt-4">:</span>
          <Digit value={time.seconds} label={t.countdown.seconds} />
        </AnimatedSection>

        {countdown.address && (
          <AnimatedSection delay={0.15} className="flex justify-center mt-8">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(countdown.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              <MapPin size={12} />
              {t.countdown.mapLink}
            </a>
          </AnimatedSection>
        )}
      </div>
    </section>
  )
}
