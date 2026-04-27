'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUserAction } from '../actions'
import { Trash } from '@phosphor-icons/react'

export default function DeleteUserButton({ userId, djName }: { userId: string; djName: string }) {
  const router    = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteUserAction(userId)
    router.push('/admin/users')
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:border-red-500/60 hover:text-red-300 transition-colors"
      >
        <Trash size={14} />
        Eliminar usuario
      </button>
    )
  }

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-xl"
      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      <p className="font-mono text-xs text-red-300">
        ¿Eliminar a <strong>{djName}</strong> y todos sus datos? Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-mono text-xs px-4 py-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
        >
          {loading ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="font-mono text-xs px-4 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
