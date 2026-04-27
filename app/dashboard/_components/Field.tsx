import type { ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'

export const inputClass =
  'bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm placeholder:text-slate-700 focus:outline-none focus:border-violet-500/60 transition-colors w-full'

export const textareaClass = `${inputClass} resize-none`

export const selectClass =
  'appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white font-body text-sm focus:outline-none focus:border-violet-500/60 transition-colors w-full'

export function SelectWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <CaretDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
      />
    </div>
  )
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs text-slate-500 tracking-widest uppercase">
        {label}
      </label>
      {children}
      {hint && !error && <p className="font-mono text-xs text-slate-600">{hint}</p>}
      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h3 className="font-display text-2xl text-white tracking-wider whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}
