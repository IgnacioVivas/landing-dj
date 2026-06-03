'use client'

import { useState, useEffect } from 'react'
import { FilePdf, ArrowSquareOut, LockSimple } from '@phosphor-icons/react'
import { useParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { verifyPressKitPassword } from '@/lib/actions/presskit'

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

function PasswordGate({
  slug,
  onVerified,
}: {
  slug:       string
  onVerified: () => void
}) {
  const { t }                       = useLanguage()
  const [pwd, setPwd]               = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pwd.trim()) return
    setLoading(true)
    setError('')
    const result = await verifyPressKitPassword(slug, pwd.trim())
    setLoading(false)
    if (result.success) {
      sessionStorage.setItem(`pkv_${slug}`, '1')
      onVerified()
    } else {
      setError(t.pressKit.wrongPwd)
    }
  }

  return (
    <div
      className="flex flex-col items-center gap-6 p-10 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'color-mix(in srgb, var(--dj-accent) 12%, transparent)' }}
      >
        <LockSimple size={28} style={{ color: 'var(--dj-accent)' }} />
      </div>

      <div className="text-center">
        <p className="font-display text-xl text-white tracking-wider mb-2">
          {t.pressKit.locked}
        </p>
        <p className="font-body text-sm text-slate-500">{t.pressKit.lockHint}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xs">
        <input
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder={t.pressKit.pwdPlaceholder}
          autoFocus
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full text-center tracking-widest"
        />

        {error && (
          <p className="font-mono text-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !pwd.trim()}
          className="btn-accent font-mono text-sm py-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? t.pressKit.unlocking : t.pressKit.unlock}
        </button>
      </form>
    </div>
  )
}

export default function PressKit() {
  const { t }        = useLanguage()
  const { pressKit } = useDjData()
  const params       = useParams<{ slug: string }>()
  const slug         = params.slug ?? ''

  const [unlocked, setUnlocked] = useState(!pressKit.passwordRequired)

  useEffect(() => {
    if (pressKit.passwordRequired && sessionStorage.getItem(`pkv_${slug}`)) {
      setUnlocked(true)
    }
  }, [slug, pressKit.passwordRequired])

  if (!pressKit.riderUrl && !pressKit.epkUrl) return null

  return (
    <section id="presskit" className="py-24 md:py-32" style={{ background: '#07070f' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-10">
          <SectionHeading overline={t.pressKit.overline} title={t.pressKit.title} />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {!unlocked ? (
            <PasswordGate slug={slug} onVerified={() => setUnlocked(true)} />
          ) : (
            <div className="flex flex-col gap-3">
              {pressKit.riderUrl && (
                <DownloadButton href={pressKit.riderUrl} label={t.pressKit.rider} />
              )}
              {pressKit.epkUrl && (
                <DownloadButton href={pressKit.epkUrl} label={t.pressKit.epk} />
              )}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
