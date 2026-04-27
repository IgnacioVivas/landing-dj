'use client'

import { useState } from 'react'
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass, textareaClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
  watch: UseFormWatch<SettingsInput>
}

type LangTab = 'es' | 'en'

function LangTabs({ active, onChange }: { active: LangTab; onChange: (l: LangTab) => void }) {
  return (
    <div className="flex gap-1 mb-5">
      {(['es', 'en'] as LangTab[]).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className="px-3 py-1 rounded font-mono text-xs tracking-widest uppercase transition-colors"
          style={
            active === l
              ? { backgroundColor: 'var(--dj-accent)', color: 'white' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }
          }
        >
          {l === 'es' ? '🇦🇷 Español' : '🇬🇧 English'}
        </button>
      ))}
    </div>
  )
}

export default function BioSection({ register, errors, watch }: Props) {
  const [tab, setTab] = useState<LangTab>('es')

  const bioShort   = watch('bioShort')   ?? ''
  const bioFull    = watch('bioFull')    ?? ''
  const bioShortEn = watch('bioShortEn') ?? ''
  const bioFullEn  = watch('bioFullEn')  ?? ''

  return (
    <div>
      <SectionTitle>Bio</SectionTitle>
      <LangTabs active={tab} onChange={setTab} />

      <div className="flex flex-col gap-4">
        {/* Nombre artístico — igual en ambos idiomas */}
        <Field label="Nombre artístico" error={errors.djName?.message}>
          <input {...register('djName')} className={inputClass} placeholder="DJ Example" />
        </Field>

        {tab === 'es' ? (
          <>
            <Field
              label="Tagline"
              error={errors.tagline?.message}
              hint="Frase corta que aparece bajo tu nombre en la landing."
            >
              <input {...register('tagline')} className={inputClass} placeholder="Minimal techno from Buenos Aires" />
            </Field>

            <Field
              label="Bio corta"
              error={errors.bioShort?.message}
              hint={`Aparece en la sección bio. Máx. 600 caracteres. (${bioShort.length}/600)`}
            >
              <textarea {...register('bioShort')} rows={3} className={textareaClass} />
            </Field>

            <Field
              label="Bio completa"
              error={errors.bioFull?.message}
              hint={`Texto extendido con "Leer más" en tu landing. Máx. 2000 caracteres. (${bioFull.length}/2000)`}
            >
              <textarea {...register('bioFull')} rows={7} className={textareaClass} />
            </Field>
          </>
        ) : (
          <>
            <Field
              label="Tagline (English)"
              error={errors.taglineEn?.message}
              hint="Short phrase shown below your name when visitors switch to English."
            >
              <input {...register('taglineEn')} className={inputClass} placeholder="Minimal techno from Buenos Aires" />
            </Field>

            <Field
              label="Short bio (English)"
              error={errors.bioShortEn?.message}
              hint={`Shown in the bio section. Max 600 chars. (${bioShortEn.length}/600)`}
            >
              <textarea {...register('bioShortEn')} rows={3} className={textareaClass} />
            </Field>

            <Field
              label="Full bio (English)"
              error={errors.bioFullEn?.message}
              hint={`Extended text behind "Read more". Max 2000 chars. (${bioFullEn.length}/2000)`}
            >
              <textarea {...register('bioFullEn')} rows={7} className={textareaClass} />
            </Field>
          </>
        )}

        <Field
          label="Géneros"
          error={errors.genres?.message}
          hint="Separados por coma: Techno, House, Minimal"
        >
          <input {...register('genres')} className={inputClass} placeholder="Techno, House, Minimal" />
        </Field>
      </div>
    </div>
  )
}
