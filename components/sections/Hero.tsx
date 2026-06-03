'use client'

import { motion } from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import GlowButton from '@/components/ui/GlowButton'
import HeroSocialLinks from '@/components/ui/HeroSocialLinks'
import { trackLead } from '@/lib/meta-pixel'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const { t, lang } = useLanguage()
  const dj = useDjData()
  const { heroImageUrl, heroImageMobileUrl, heroTitle, heroTitleEn, heroOverlay, heroLayout } = dj.theme

  const displayTitle   = lang === 'en' ? (heroTitleEn || heroTitle || dj.name) : (heroTitle || dj.name)
  const displayTagline = lang === 'en' ? (dj.taglineEn || dj.tagline) : dj.tagline

  const navLinks = [
    { label: t.nav.bio,      href: '#bio' },
    { label: t.nav.releases, href: '#releases' },
    { label: t.nav.shows,    href: '#shows' },
    { label: t.nav.media,    href: '#media' },
    { label: t.nav.contact,  href: '#contact' },
  ]

  const hasImage = Boolean(heroImageUrl || heroImageMobileUrl)

  const bgImages = (
    <>
      {heroImageUrl && (
        <Image
          src={heroImageUrl}
          alt=""
          fill
          className={`object-cover ${heroImageMobileUrl ? 'hidden md:block' : ''}`}
          priority
          sizes="100vw"
        />
      )}
      {heroImageMobileUrl && (
        <Image
          src={heroImageMobileUrl}
          alt=""
          fill
          className="object-cover md:hidden"
          priority
          sizes="100vw"
        />
      )}
    </>
  )

  const orbs = (
    <>
      <div
        className="orb-1 absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'var(--dj-purple-dim)', filter: 'blur(120px)' }}
      />
      <div
        className="orb-2 absolute bottom-[10%] right-[8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'var(--dj-cyan-dim)', filter: 'blur(100px)' }}
      />
      <div
        className="orb-3 absolute top-[35%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'color-mix(in srgb, var(--dj-accent) 6%, transparent)', filter: 'blur(80px)' }}
      />
    </>
  )

  if (heroLayout === 'integrated') {
    return (
      <section className="relative flex flex-col items-center justify-end md:justify-center h-screen overflow-hidden bg-[#07070f]" style={{ contain: 'paint' }}>
        {bgImages}
        {hasImage && heroOverlay && <div className="absolute inset-0 bg-[#07070f]/75" />}
        {/* Extra bottom gradient on mobile so the text sits on a darker base */}
        <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-[#07070f]/80 to-transparent md:hidden pointer-events-none" />
        {orbs}

        <div className="relative z-10 flex flex-col items-center text-center px-4 pb-10 md:pb-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.3em] text-white md:text-slate-500 uppercase mb-4"
          >
            {dj.genres.join(' · ')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="font-display gradient-text leading-none tracking-tight text-glow-purple"
            style={{ fontSize: 'clamp(4rem, 16vw, 12rem)' }}
          >
            {displayTitle}
          </motion.h1>

          {displayTagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mt-3 font-body text-white md:text-slate-400 text-base md:text-lg tracking-widest uppercase"
            >
              {displayTagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="flex flex-wrap items-center justify-center gap-4 mt-6"
          >
            <GlowButton href="#contact" onClick={trackLead}>{t.hero.bookNow}</GlowButton>
            <HeroSocialLinks social={dj.social} size={24} />
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 pt-5 border-t border-white/10"
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-xs text-white md:text-slate-500 hover:text-white transition-colors tracking-widest uppercase"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        </div>
      </section>
    )
  }

  // Default: classic centered layout
  return (
    <section className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-[#07070f]" style={{ contain: 'paint' }}>
      {bgImages}
      {hasImage && heroOverlay && <div className="absolute inset-0 bg-[#07070f]/75" />}
      {orbs}

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-mono text-xs tracking-[0.3em] text-slate-500 uppercase mb-6"
        >
          {dj.genres.join(' · ')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="font-display gradient-text leading-none tracking-tight text-glow-purple"
          style={{ fontSize: 'clamp(5rem, 20vw, 18rem)' }}
        >
          {displayTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-4 font-body text-slate-400 text-base md:text-lg tracking-widest uppercase"
        >
          {displayTagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
          className="flex flex-col sm:flex-row gap-3 mt-10"
        >
          <GlowButton href="#contact">{t.hero.bookNow}</GlowButton>
          <GlowButton href="#releases" variant="outline">{t.hero.listenNow}</GlowButton>
        </motion.div>
      </div>

      <motion.a
        href="#bio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  )
}
