'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validations/auth'
import { changePasswordAction } from '../actions'
import PasswordInput from '@/components/ui/PasswordInput'

const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-body text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-colors w-full'

export default function PasswordSection() {
  const [serverError, setServerError] = useState('')
  const [success,     setSuccess]     = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  async function onSubmit(data: ChangePasswordInput) {
    setServerError('')
    setSuccess(false)
    const result = await changePasswordAction(data)
    if ('error' in result) { setServerError(result.error); return }
    setSuccess(true)
    reset()
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-white tracking-wider mb-1">Contraseña</h3>
        <p className="font-mono text-xs text-slate-500">Cambiá tu contraseña de acceso.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
        {[
          { name: 'currentPassword' as const, label: 'Contraseña actual',   auto: 'current-password' },
          { name: 'newPassword'     as const, label: 'Nueva contraseña',    auto: 'new-password'     },
          { name: 'confirmPassword' as const, label: 'Confirmar contraseña', auto: 'new-password'    },
        ].map(({ name, label, auto }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">{label}</label>
            <PasswordInput
              {...register(name)}
              autoComplete={auto}
              placeholder="••••••••"
              inputClassName={inputClass}
            />
            {errors[name] && (
              <p className="font-mono text-xs text-red-400">{errors[name]?.message}</p>
            )}
          </div>
        ))}

        {serverError && <p className="font-mono text-xs text-red-400">{serverError}</p>}
        {success     && <p className="font-mono text-xs text-green-400">Contraseña actualizada correctamente.</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-accent font-mono text-sm px-5 py-2.5 rounded-xl text-white mt-1"
        >
          {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  )
}
