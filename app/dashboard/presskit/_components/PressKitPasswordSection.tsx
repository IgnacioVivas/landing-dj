'use client'

import { useState } from 'react'
import { Eye, EyeSlash, Copy, Check, Lock, LockOpen } from '@phosphor-icons/react'
import { updatePressKitPasswordAction } from '../actions'

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full'

export default function PressKitPasswordSection({
  initialPassword,
}: {
  initialPassword: string | null
}) {
  const [current,  setCurrent]  = useState(initialPassword)
  const [visible,  setVisible]  = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [newPwd,   setNewPwd]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  function clearMessages() {
    setSuccess('')
    setError('')
  }

  function handleCopy() {
    if (!current) return
    navigator.clipboard.writeText(current).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleSave() {
    if (!newPwd.trim()) { setError('Ingresá una contraseña.'); return }
    clearMessages()
    setLoading(true)
    const result = await updatePressKitPasswordAction(newPwd)
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setCurrent(newPwd.trim())
    setNewPwd('')
    setSuccess('Contraseña guardada.')
  }

  async function handleRemove() {
    clearMessages()
    setLoading(true)
    const result = await updatePressKitPasswordAction('')
    setLoading(false)
    if ('error' in result) { setError(result.error); return }
    setCurrent(null)
    setSuccess('Protección eliminada.')
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">
          Contraseña del Press Kit
        </h3>
        <p className="font-mono text-xs text-slate-500">
          Protegé los archivos de prensa con una contraseña que vos mismo compartís.
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        {current ? (
          <>
            <Lock size={13} className="text-green-400" weight="fill" />
            <span className="font-mono text-xs text-green-400">Activa — los archivos están protegidos</span>
          </>
        ) : (
          <>
            <LockOpen size={13} className="text-slate-500" />
            <span className="font-mono text-xs text-slate-500">Sin protección — los archivos son públicos</span>
          </>
        )}
      </div>

      {/* Current password display */}
      {current && (
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">
            Contraseña actual
          </label>
          <div className="flex items-center gap-2 max-w-sm">
            <div className="relative flex-1">
              <input
                readOnly
                type={visible ? 'text' : 'password'}
                value={current}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setVisible(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={visible ? 'Ocultar' : 'Mostrar'}
              >
                {visible ? <EyeSlash size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.08] transition-colors font-mono text-xs text-slate-400 hover:text-white shrink-0"
            >
              {copied
                ? <><Check size={13} className="text-green-400" /> Copiado</>
                : <><Copy size={13} /> Copiar</>
              }
            </button>
          </div>
          <p className="font-mono text-xs text-slate-600">
            Compartí esta contraseña con periodistas o promotores para que accedan.
          </p>
        </div>
      )}

      {/* Set / change */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">
          {current ? 'Nueva contraseña' : 'Activar protección'}
        </label>
        <input
          type="text"
          value={newPwd}
          onChange={e => { setNewPwd(e.target.value); clearMessages() }}
          placeholder="Ej: prensa2025"
          className={inputClass}
        />
        <p className="font-mono text-xs text-slate-600">
          No hay requisitos mínimos — usá lo que sea fácil de compartir.
        </p>
      </div>

      {error   && <p className="font-mono text-xs text-red-400">{error}</p>}
      {success && <p className="font-mono text-xs text-green-400">{success}</p>}

      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleSave}
          className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white disabled:opacity-50"
        >
          {loading ? 'Guardando...' : current ? 'Cambiar contraseña' : 'Activar protección'}
        </button>

        {current && (
          <button
            type="button"
            disabled={loading}
            onClick={handleRemove}
            className="font-mono text-xs text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Quitar protección
          </button>
        )}
      </div>
    </section>
  )
}
