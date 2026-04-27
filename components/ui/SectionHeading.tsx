import { cn } from '@/lib/utils'
import AnimatedSection from './AnimatedSection'

interface Props {
  overline: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({
  overline,
  title,
  description,
  align = 'left',
  className,
}: Props) {
  const isCenter = align === 'center'

  return (
    <div className={cn(isCenter && 'text-center', className)}>
      <AnimatedSection>
        <p className="font-mono text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--dj-accent)' }}>
          — {overline}
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-none tracking-tight">
          {title}
        </h2>
      </AnimatedSection>

      {description && (
        <AnimatedSection delay={0.16}>
          <p
            className={cn(
              'mt-4 text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl',
              isCenter && 'mx-auto',
            )}
          >
            {description}
          </p>
        </AnimatedSection>
      )}
    </div>
  )
}
