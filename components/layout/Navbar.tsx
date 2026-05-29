'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import GlowButton from '@/components/ui/GlowButton'
import HeroSocialLinks from '@/components/ui/HeroSocialLinks'

export default function Navbar() {
  const { t } = useLanguage()
  const dj = useDjData()
  const isIntegrated = dj.theme.heroLayout === 'integrated'

  const [scrolled,    setScrolled]    = useState(false)
  const [hidden,      setHidden]      = useState(false)
  const [atTop,       setAtTop]       = useState(true)
  const [pastHero,    setPastHero]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current
      setAtTop(y < 10)
      setScrolled(y > 60)
      setHidden(goingDown && y > 60)
      if (isIntegrated) setPastHero(y > window.innerHeight * 0.7)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isIntegrated])

  useEffect(() => {
    if (!atTop) setMobileOpen(false)
  }, [atTop])

  const navLinks = [
    { label: t.nav.bio,       href: '#bio' },
    { label: t.nav.releases,  href: '#releases' },
    { label: t.nav.shows,     href: '#shows' },
    { label: t.nav.media,     href: '#media' },
    { label: t.nav.instagram, href: '#instagram' },
    { label: t.nav.contact,   href: '#contact' },
  ]

  // Compute translate class:
  // - integrated + in hero → completely hidden (all screens)
  // - scrolling down on mobile (center mode, or integrated past hero) → mobile only hidden
  // - otherwise → visible
  const withinHero = isIntegrated && !pastHero
  const translateClass = withinHero
    ? '-translate-y-full'
    : hidden
      ? '-translate-y-full md:translate-y-0'
      : 'translate-y-0'

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'bg-[#07070f]/85 backdrop-blur-xl border-white/5'
          : 'bg-transparent border-transparent',
        translateClass,
      )}
    >
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-2xl text-white tracking-wider hover:text-violet-400 transition-colors flex-shrink-0"
        >
          {dj.name}
        </a>

        {/* Desktop links — absolutely centered */}
        <ul className="hidden lg:flex items-center gap-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {navLinks.map((link) => (
            <li key={link.href} className="pointer-events-auto">
              <a
                href={link.href}
                className="font-body text-sm text-slate-400 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right: social icons + CTA */}
        <div className="ml-auto hidden md:flex items-center gap-3 flex-shrink-0">
          {(dj.social.instagram || dj.social.spotify || dj.social.soundcloud || dj.social.youtube) && (
            <div className="pr-3 border-r border-white/10">
              <HeroSocialLinks social={dj.social} size={18} />
            </div>
          )}
          <GlowButton href="#contact" variant="primary">
            {t.nav.bookNow}
          </GlowButton>
        </div>

        {/* Mobile right: contact button + hamburger only at top */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          <GlowButton href="#contact" variant="primary" className="px-4 py-2 text-xs">
            {t.nav.bookNow}
          </GlowButton>
          {atTop && (
            <button
              className="text-white p-1"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <List size={24} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && atTop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07070f]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-slate-300 hover:text-white font-body text-sm tracking-wide"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}

              <div className="pt-2 border-t border-white/5 mt-1">
                <HeroSocialLinks social={dj.social} size={22} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
