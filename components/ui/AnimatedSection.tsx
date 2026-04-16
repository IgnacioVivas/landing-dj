'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: Direction
  once?: boolean
}

const initialMap: Record<Direction, { opacity: number; x?: number; y?: number }> = {
  up:    { opacity: 0, y: 50 },
  down:  { opacity: 0, y: -50 },
  left:  { opacity: 0, x: 50 },
  right: { opacity: 0, x: -50 },
  none:  { opacity: 0 },
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={initialMap[direction]}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
