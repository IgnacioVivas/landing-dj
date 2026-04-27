'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CaretDown } from '@phosphor-icons/react'
import { updateSubscriptionAction } from '../actions'
import { addMonths, format } from 'date-fns'

type Props = {
  userId:  string
  current: {
    status:    string
    startDate: Date
    expiresAt: Date
    notes:     string
  } | null
}

const QUICK_EXTEND = [1, 2, 3, 6, 12]

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-white/20 transition-colors'

const selectClass =
  'appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white font-body text-sm focus:outline-none focus:border-white/20 transition-colors'

export default function SubscriptionEditor({ userId, current }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const [status,    setStatus]    = useState(current?.status    ?? 'ACTIVE')
  const [startDate, setStartDate] = useState(
    current?.startDate ? format(current.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  )
  const [expiresAt, setExpiresAt] = useState(
    current?.expiresAt ? format(current.expiresAt, 'yyyy-MM-dd') : format(addMonths(new Date(), 1), 'yyyy-MM-dd')
  )
  const [notes, setNotes] = useState(current?.notes ?? '')

  function quickExtend(months: number) {
    const base = new Date(expiresAt)
    const from = base > new Date() ? base : new Date()
    setExpiresAt(format(addMonths(from, months), 'yyyy-MM-dd'))
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    setSuccess(false)
    const result = await updateSubscriptionAction({ userId, status, startDate, expiresAt, notes })
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setSuccess(true)
    router.refresh()
  }

  return (
    <div
      className="flex flex-col gap-5 p-6 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <h3 className="font-display text-xl text-white tracking-wider">Suscripción</h3>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Estado</label>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectClass}
          >
            <option value="ACTIVE"    className="bg-[#07070f]">Activo</option>
            <option value="EXPIRED"   className="bg-[#07070f]">Vencido</option>
            <option value="SUSPENDED" className="bg-[#07070f]">Suspendido</option>
          </select>
          <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Inicio',      value: startDate, setter: setStartDate },
          { label: 'Vencimiento', value: expiresAt, setter: setExpiresAt },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">{label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-slate-400 tracking-wider uppercase">Extender rápido</span>
        <div className="flex gap-2 flex-wrap">
          {QUICK_EXTEND.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => quickExtend(m)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-colors"
            >
              +{m}m
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Plan, observaciones..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 resize-none"
        />
      </div>

      {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
      {success && <p className="font-mono text-xs text-green-400">Guardado correctamente.</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white"
      >
        {loading ? 'Guardando...' : 'Guardar suscripción'}
      </button>
    </div>
  )
}
