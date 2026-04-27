'use client'

import { FilePdf, ArrowSquareOut } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--dj-accent) 30%, transparent)'
        e.currentTarget.style.background  = 'color-mix(in srgb, var(--dj-accent) 5%, transparent)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background  = 'rgba(255,255,255,0.03)'
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'color-mix(in srgb, var(--dj-accent) 12%, transparent)' }}
      >
        <FilePdf size={20} style={{ color: 'var(--dj-accent)' }} />
      </div>
      <span className="flex-1 font-body text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <ArrowSquareOut size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
    </a>
  )
}

export default function PressKit() {
  const { t }        = useLanguage()
  const { pressKit } = useDjData()

  if (!pressKit.riderUrl && !pressKit.epkUrl) return null

  return (
    <section id="presskit" className="py-24 md:py-32" style={{ background: '#07070f' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <SectionHeading overline={t.pressKit.overline} title={t.pressKit.title} />
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="flex flex-col gap-3">
          {pressKit.riderUrl && (
            <DownloadButton href={pressKit.riderUrl} label={t.pressKit.rider} />
          )}
          {pressKit.epkUrl && (
            <DownloadButton href={pressKit.epkUrl} label={t.pressKit.epk} />
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
