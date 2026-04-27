'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CaretDown } from '@phosphor-icons/react'
import { createDjAction } from '../actions'
import PasswordInput from '@/components/ui/PasswordInput'

const MONTH_OPTIONS = [1, 2, 3, 6, 12]

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors'

const selectClass =
  'appearance-none w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white font-body text-sm focus:outline-none focus:border-white/20 transition-colors'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">
      {children}
    </label>
  )
}

export default function CreateUserForm() {
  const router    = useRouter()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd     = new FormData(e.currentTarget)
    const result = await createDjAction({
      email:    fd.get('email'),
      password: fd.get('password'),
      djName:   fd.get('djName'),
      slug:     fd.get('slug'),
      months:   fd.get('months'),
      notes:    fd.get('notes'),
    })

    setLoading(false)
    if (result?.error) { setError(result.error); return }
    router.push('/admin/users')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">

      {/* ── Identidad ─────────────────────────────────── */}
      <div
        className="p-6 rounded-2xl flex flex-col gap-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Identidad</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre artístico</Label>
            <input name="djName" type="text" placeholder="DJ Example" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Slug (URL)</Label>
            <div className="flex items-center">
              <span
                className="shrink-0 bg-white/5 border border-r-0 border-white/10 rounded-l-xl px-3 py-2.5 font-mono text-xs text-slate-600 whitespace-nowrap"
              >
                /dj/
              </span>
              <input
                name="slug"
                type="text"
                placeholder="dj-example"
                required
                className="w-full bg-white/5 border border-white/10 rounded-r-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Credenciales ──────────────────────────────── */}
      <div
        className="p-6 rounded-2xl flex flex-col gap-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Credenciales</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <input name="email" type="email" placeholder="dj@example.com" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Contraseña</Label>
            <PasswordInput
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              inputClassName={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ── Suscripción ───────────────────────────────── */}
      <div
        className="p-6 rounded-2xl flex flex-col gap-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Suscripción</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Duración</Label>
            <div className="relative">
              <select name="months" defaultValue="1" className={selectClass}>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m} className="bg-[#07070f]">
                    {m} {m === 1 ? 'mes' : 'meses'}
                  </option>
                ))}
              </select>
              <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Notas (opcional)</Label>
            <textarea
              name="notes"
              rows={1}
              placeholder="Plan contratado, observaciones..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 resize-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent font-mono text-sm px-8 py-2.5 rounded-xl text-white"
        >
          {loading ? 'Creando...' : 'Crear DJ'}
        </button>
      </div>
    </form>
  )
}
