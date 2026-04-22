'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import GlowButton from '@/components/ui/GlowButton'

export default function Navbar() {
  const { t } = useLanguage()
  const { name } = useDjData()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: t.nav.bio,       href: '#bio' },
    { label: t.nav.releases,  href: '#releases' },
    { label: t.nav.shows,     href: '#shows' },
    { label: t.nav.media,     href: '#media' },
    { label: t.nav.instagram, href: '#instagram' },
    { label: t.nav.contact,   href: '#contact' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 border-b transition-all duration-500',
        scrolled
          ? 'bg-[#07070f]/85 backdrop-blur-xl border-white/5'
          : 'bg-transparent border-transparent',
      )}
    >
      {/*
        3-column layout with absolute center:
        - Logo: left (natural flow)
        - Nav links: absolute, centered relative to the full nav width
        - Right side: ml-auto (Book Now + lang flags)
        This avoids the centering drift caused by unequal left/right widths.
      */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-2xl text-white tracking-wider hover:text-violet-400 transition-colors flex-shrink-0"
        >
          {name}
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

        {/* Right side: CTA */}
        <div className="ml-auto hidden md:flex items-center flex-shrink-0">
          <GlowButton href="#contact" variant="primary">
            {t.nav.bookNow}
          </GlowButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="ml-auto md:hidden text-white p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
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

              <div className="pt-2">
                <GlowButton href="#contact" className="w-full" onClick={() => setMobileOpen(false)}>
                  {t.nav.bookNow}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
