'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateDjInfoAction } from '../actions'

type Props = {
  userId: string
  initialDjName: string
  initialEmail:  string
  initialSlug:   string
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors'

export default function EditDjForm({ userId, initialDjName, initialEmail, initialSlug }: Props) {
  const router  = useRouter()
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const fd     = new FormData(e.currentTarget)
    const result = await updateDjInfoAction({
      userId,
      djName: fd.get('djName'),
      email:  fd.get('email'),
      slug:   fd.get('slug'),
    })

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
      <h3 className="font-display text-xl text-white tracking-wider">Datos del DJ</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Nombre artístico</label>
            <input name="djName" defaultValue={initialDjName} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Slug (URL)</label>
            <div className="flex items-center">
              <span className="shrink-0 bg-white/5 border border-r-0 border-white/10 rounded-l-xl px-3 py-2.5 font-mono text-xs text-slate-600">
                /dj/
              </span>
              <input
                name="slug"
                defaultValue={initialSlug}
                required
                className="w-full bg-white/5 border border-white/10 rounded-r-xl px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Email</label>
          <input name="email" type="email" defaultValue={initialEmail} required className={inputClass} />
        </div>

        {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
        {success && <p className="font-mono text-xs text-green-400">Datos actualizados correctamente.</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
