'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { changeEmailSchema, type ChangeEmailInput } from '@/lib/validations/auth'
import { changeEmailAction } from '../actions'
import PasswordInput from '@/components/ui/PasswordInput'

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full'

export default function EmailSection({ currentEmail }: { currentEmail: string }) {
  const [serverError, setServerError] = useState('')
  const [success,     setSuccess]     = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
  })

  async function onSubmit(data: ChangeEmailInput) {
    setServerError('')
    setSuccess('')
    const result = await changeEmailAction(data)
    if ('error' in result) { setServerError(result.error); return }
    setSuccess(`Email actualizado a ${data.newEmail}. Usalo para tu próximo login.`)
    reset()
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">Email de acceso</h3>
        <p className="font-mono text-xs text-slate-500">
          Email actual: <span className="text-slate-400">{currentEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Nuevo email</label>
          <input
            {...register('newEmail')}
            type="email"
            placeholder="nuevo@email.com"
            className={inputClass}
          />
          {errors.newEmail && <p className="font-mono text-xs text-red-400">{errors.newEmail.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">Contraseña actual</label>
          <PasswordInput
            {...register('currentPassword')}
            autoComplete="current-password"
            placeholder="••••••••"
            inputClassName={inputClass}
          />
          {errors.currentPassword && (
            <p className="font-mono text-xs text-red-400">{errors.currentPassword.message}</p>
          )}
        </div>

        {serverError && <p className="font-mono text-xs text-red-400">{serverError}</p>}
        {success     && <p className="font-mono text-xs text-green-400">{success}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white mt-1"
        >
          {isSubmitting ? 'Guardando...' : 'Cambiar email'}
        </button>
      </form>
    </section>
  )
}
