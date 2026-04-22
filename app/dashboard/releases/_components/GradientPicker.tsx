'use client'

import { useState } from 'react'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import type { ReleaseInput } from '@/lib/validations/release'

const PRESETS = [
  { label: 'Noche',   value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
  { label: 'Violeta', value: 'linear-gradient(135deg, #2d1b69 0%, #0f3460 100%)' },
  { label: 'Fuego',   value: 'linear-gradient(135deg, #3a0000 0%, #8b0000 100%)' },
  { label: 'Océano',  value: 'linear-gradient(135deg, #0a001a 0%, #003366 100%)' },
  { label: 'Aurora',  value: 'linear-gradient(135deg, #0d0d0d 0%, #1a0533 60%, #00d4ff22 100%)' },
  { label: 'Esmeralda', value: 'linear-gradient(135deg, #0a1a0a 0%, #0d3b2e 100%)' },
  { label: 'Crepúsculo', value: 'linear-gradient(135deg, #1a0030 0%, #4a0060 50%, #0d0d1a 100%)' },
  { label: 'Carbón',  value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' },
]

type Props = {
  setValue: UseFormSetValue<ReleaseInput>
  watch: UseFormWatch<ReleaseInput>
}

export default function GradientPicker({ setValue, watch }: Props) {
  const current = watch('coverGradient')
  const [custom, setCustom] = useState(
    !PRESETS.some(p => p.value === current)
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map(preset => (
          <button
            key={preset.value}
            type="button"
            title={preset.label}
            onClick={() => { setValue('coverGradient', preset.value); setCustom(false) }}
            className="h-10 rounded-lg transition-all"
            style={{
              background:  preset.value,
              outline:     current === preset.value ? '2px solid #8b5cf6' : '2px solid transparent',
              outlineOffset: '2px',
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCustom(v => !v)}
        className="font-mono text-xs text-slate-600 hover:text-slate-400 text-left transition-colors"
      >
        {custom ? '↑ Ocultar personalizado' : '+ Gradiente personalizado'}
      </button>

      {custom && (
        <input
          value={current}
          onChange={e => setValue('coverGradient', e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-mono text-xs placeholder:text-slate-700 focus:outline-none focus:border-violet-500/60 transition-colors w-full"
          placeholder="linear-gradient(135deg, #000 0%, #111 100%)"
        />
      )}

      <div
        className="h-8 rounded-lg mt-1"
        style={{ background: current }}
      />
    </div>
  )
}
