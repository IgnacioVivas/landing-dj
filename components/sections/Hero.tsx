'use client'

import { motion } from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDjData } from '@/lib/dj-context'
import GlowButton from '@/components/ui/GlowButton'

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const { t } = useLanguage()
  const dj = useDjData()

  return (
    <section className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-[#07070f]" style={{ contain: 'paint' }}>
      {/* Animated background orbs */}
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
        style={{ background: 'rgba(139, 92, 246, 0.06)', filter: 'blur(80px)' }}
      />

      {/* Content */}
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
          {dj.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
          className="mt-4 font-body text-slate-400 text-base md:text-lg tracking-widest uppercase"
        >
          {dj.tagline}
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

      {/* Scroll indicator */}
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
