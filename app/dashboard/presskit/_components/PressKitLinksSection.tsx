'use client'

import { useState } from 'react'
import { updatePressKitLinksAction } from '../actions'

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full'

export default function PressKitLinksSection({
  initialRiderUrl,
  initialEpkUrl,
}: {
  initialRiderUrl: string | null
  initialEpkUrl:   string | null
}) {
  const [riderUrl, setRiderUrl] = useState(initialRiderUrl ?? '')
  const [epkUrl,   setEpkUrl]   = useState(initialEpkUrl   ?? '')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  async function handleSave() {
    setSuccess('')
    setError('')
    setLoading(true)
    const result = await updatePressKitLinksAction(riderUrl.trim(), epkUrl.trim())
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setSuccess('Links guardados.')
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">Rider y EPK</h3>
        <p className="font-mono text-xs text-slate-500">
          Links directos a los PDFs de tu rider técnico y tu press kit.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Rider técnico</label>
          <input
            value={riderUrl}
            onChange={e => { setRiderUrl(e.target.value); setSuccess(''); setError('') }}
            placeholder="https://drive.google.com/... (opcional)"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Press Kit / EPK</label>
          <input
            value={epkUrl}
            onChange={e => { setEpkUrl(e.target.value); setSuccess(''); setError('') }}
            placeholder="https://drive.google.com/... (opcional)"
            className={inputClass}
          />
        </div>

        <p className="font-mono text-xs text-slate-700">
          Para compartir PDFs gratis: subí a Google Drive y copiá el link de &quot;Cualquier persona con el enlace&quot;.
        </p>
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
