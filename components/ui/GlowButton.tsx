'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost'

interface Props {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const base =
  'relative inline-flex items-center justify-center gap-2 font-body font-semibold text-sm tracking-wide px-7 py-3.5 rounded-full transition-all duration-200 cursor-pointer'

const variants: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-500 glow-purple hover:glow-purple',
  outline:
    'border border-white/20 text-white hover:border-violet-400 hover:bg-white/5',
  ghost:
    'text-slate-400 hover:text-white hover:bg-white/5',
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  type = 'button',
  disabled,
}: Props) {
  const classes = cn(base, variants[variant], disabled && 'opacity-50 pointer-events-none', className)

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
