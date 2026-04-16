'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  InstagramLogo,
  SpotifyLogo,
  SoundcloudLogo,
  EnvelopeSimple,
  CheckCircle,
} from '@phosphor-icons/react'
import { djConfig } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ContactFormData } from '@/lib/types'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import GlowButton from '@/components/ui/GlowButton'

const INITIAL: ContactFormData = { name: '', email: '', type: 'booking', message: '' }

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 font-body text-sm focus:outline-none focus:border-violet-500/60 transition-colors'

export default function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState<ContactFormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const TYPES = [
    { value: 'booking' as const, label: t.contact.booking },
    { value: 'press'   as const, label: t.contact.press },
    { value: 'other'   as const, label: t.contact.other },
  ]

  function set(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#07070f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              overline={t.contact.overline}
              title={t.contact.title}
              description={t.contact.description}
            />

            <AnimatedSection delay={0.1} className="space-y-4">
              <InfoRow
                icon={<EnvelopeSimple size={16} />}
                label={t.contact.bookingLabel}
                value={djConfig.contact.bookingEmail}
                href={`mailto:${djConfig.contact.bookingEmail}`}
              />
              <InfoRow
                icon={<EnvelopeSimple size={16} />}
                label={t.contact.pressLabel}
                value={djConfig.contact.pressEmail}
                href={`mailto:${djConfig.contact.pressEmail}`}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="font-mono text-xs text-slate-600 tracking-wider uppercase mb-4">
                {t.contact.socialTitle}
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <InstagramLogo size={20} />, href: djConfig.social.instagram },
                  { icon: <SpotifyLogo size={20} />,   href: djConfig.social.spotify },
                  { icon: <SoundcloudLogo size={20} />,href: djConfig.social.soundcloud },
                ].map(({ icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl text-slate-500 hover:text-violet-400 transition-colors"
                    style={{ background: 'var(--dj-surface)', border: '1px solid var(--dj-border)' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: form */}
          <AnimatedSection delay={0.15} direction="left">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 h-full min-h-64 text-center"
              >
                <CheckCircle size={48} className="text-violet-400" />
                <h3 className="font-display text-3xl text-white">{t.contact.success}</h3>
                <p className="font-body text-slate-400 text-sm">{t.contact.successDesc}</p>
                <GlowButton variant="ghost" onClick={() => { setForm(INITIAL); setStatus('idle') }}>
                  {t.contact.sendAnother}
                </GlowButton>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    className={inputClass}
                    placeholder={t.contact.namePlaceholder}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  {TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => set('type', type.value)}
                      className={`flex-1 py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
                        form.type === type.value
                          ? 'bg-violet-600 text-white'
                          : 'text-slate-500 hover:text-white'
                      }`}
                      style={
                        form.type !== type.value
                          ? { background: 'var(--dj-surface)', border: '1px solid var(--dj-border)' }
                          : {}
                      }
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className={`${inputClass} resize-none`}
                  rows={5}
                  placeholder={t.contact.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                />

                {status === 'error' && (
                  <p className="font-mono text-xs text-red-400">{t.contact.error}</p>
                )}

                <GlowButton type="submit" disabled={status === 'loading'} className="w-full">
                  {status === 'loading' ? t.contact.sending : t.contact.send}
                </GlowButton>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

function InfoRow({
  icon, label, value, href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl group transition-colors hover:bg-white/[0.03]"
      style={{ border: '1px solid var(--dj-border)' }}
    >
      <span className="text-violet-400">{icon}</span>
      <div>
        <p className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">{label}</p>
        <p className="font-body text-sm text-slate-300 group-hover:text-white transition-colors">
          {value}
        </p>
      </div>
    </a>
  )
}
