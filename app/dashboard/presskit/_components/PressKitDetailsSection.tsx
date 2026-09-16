'use client'

import { useState } from 'react'
import { updatePressKitDetailsAction } from '../actions'

const textareaClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full min-h-28 resize-y'

const fields = [
  { key: 'equipment',   label: 'Equipamiento DJ',     placeholder: '3x Pioneer CDJ-3000\n1x Mezclador Pioneer DJM-V10\n1x Pioneer RMX-1000 / Ignite (opcional)' },
  { key: 'monitoring',  label: 'Monitoreo',            placeholder: '2x Monitores de cabina activos de alta potencia (L y R) con control de volumen independiente' },
  { key: 'ergonomics',  label: 'Ergonomía y cabina',   placeholder: 'Mesa de cabina sólida y estable (Altura: 100-120 cm). La cabina debe estar libre de vibraciones.' },
  { key: 'hospitality', label: 'Hospitality',          placeholder: 'Catering, camarín, bebidas, traslados, alojamiento, etc.' },
] as const

type FieldKey = typeof fields[number]['key']

export default function PressKitDetailsSection({
  initialEquipment,
  initialMonitoring,
  initialErgonomics,
  initialHospitality,
}: {
  initialEquipment:   string
  initialMonitoring:  string
  initialErgonomics:  string
  initialHospitality: string
}) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    equipment:   initialEquipment,
    monitoring:  initialMonitoring,
    ergonomics:  initialErgonomics,
    hospitality: initialHospitality,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  async function handleSave() {
    setSuccess('')
    setError('')
    setLoading(true)
    const result = await updatePressKitDetailsAction(
      values.equipment, values.monitoring, values.ergonomics, values.hospitality,
    )
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setSuccess('Guardado.')
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">Detalle del rider</h3>
        <p className="font-mono text-xs text-slate-500">
          Un renglón por ítem — se muestra como lista en la landing. Dejá vacío lo que no quieras mostrar.
        </p>
      </div>

      <div className="flex flex-col gap-5 max-w-lg">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">{label}</label>
            <textarea
              value={values[key]}
              onChange={e => { setValues(v => ({ ...v, [key]: e.target.value })); setSuccess(''); setError('') }}
              placeholder={placeholder}
              className={textareaClass}
            />
          </div>
        ))}
      </div>

      {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
      {success && <p className="font-mono text-xs text-green-400">{success}</p>}

      <div>
        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </section>
  )
}
