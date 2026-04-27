'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useDjData } from '@/lib/dj-context'

const ease = [0.16, 1, 0.3, 1] as const

export default function PageLoader() {
  const dj = useDjData()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#07070f] overflow-hidden"
        >
          {/* Orbs */}
          <div
            className="orb-1 absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'var(--dj-purple-dim)', filter: 'blur(120px)' }}
          />
          <div
            className="orb-2 absolute bottom-[10%] right-[8%] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'var(--dj-cyan-dim)', filter: 'blur(100px)' }}
          />

          {/* Genres */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="font-mono text-xs tracking-[0.3em] text-slate-500 uppercase mb-5"
          >
            {dj.genres.join(' · ')}
          </motion.p>

          {/* DJ name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="font-display gradient-text text-glow-purple leading-none tracking-tight"
            style={{ fontSize: 'clamp(4rem, 18vw, 14rem)' }}
          >
            {dj.name}
          </motion.h1>

          {/* Animated dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 mt-10"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--dj-accent)' }}
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration:   0.9,
                  repeat:     Infinity,
                  delay:      i * 0.18,
                  ease:       'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
