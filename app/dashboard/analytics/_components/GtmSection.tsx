'use client'

import { useState } from 'react'
import { updateGtmAction } from '../actions'

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full'

export default function GtmSection({ initialGtmId }: { initialGtmId: string | null }) {
  const [gtmId,   setGtmId]   = useState(initialGtmId ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  async function handleSave() {
    setSuccess('')
    setError('')
    setLoading(true)
    const result = await updateGtmAction(gtmId)
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setSuccess('Guardado.')
  }

  return (
    <div
      className="p-6 rounded-2xl mb-6"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-5">Google Tag Manager</p>

      <div className="flex flex-col gap-2 max-w-sm">
        <input
          value={gtmId}
          onChange={e => { setGtmId(e.target.value); setSuccess(''); setError('') }}
          placeholder="GTM-ABC1234"
          className={inputClass}
        />
        <p className="font-mono text-xs text-slate-600">
          ID del contenedor de GTM. Con esto activo podés disparar GA4 y cualquier otro tag desde ahí.
        </p>

        {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
        {success && <p className="font-mono text-xs text-green-400">{success}</p>}

        <div>
          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white disabled:opacity-50 mt-1"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
