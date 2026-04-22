'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { registerAction } from '../actions'

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
}

const inputClass =
  'bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm placeholder:text-slate-700 focus:outline-none focus:border-violet-500/60 transition-colors w-full'

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string
  error?: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs text-slate-500 tracking-widest uppercase">
        {label}
      </label>
      {children}
      {hint && !error && <p className="font-mono text-xs text-slate-600">{hint}</p>}
      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setServerError(null)
    const result = await registerAction(data)
    if ('error' in result) {
      setServerError(result.error)
      return
    }
    router.push('/login?registered=1')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Código de invitación" error={errors.inviteCode?.message}>
        <input
          {...register('inviteCode')}
          type="text"
          autoComplete="off"
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      <Field label="Nombre artístico" error={errors.djName?.message}>
        <input
          {...register('djName', {
            onChange: e => setValue('slug', slugify(e.target.value), { shouldValidate: false }),
          })}
          type="text"
          autoComplete="name"
          placeholder="DJ Example"
          className={inputClass}
        />
      </Field>

      <Field
        label="URL de tu landing"
        error={errors.slug?.message}
        hint="tudominio.com/dj/tu-slug"
      >
        <div className="flex items-center gap-0">
          <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-lg px-3 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
            /dj/
          </span>
          <input
            {...register('slug')}
            type="text"
            placeholder="mi-nombre"
            className="bg-white/5 border border-white/10 rounded-r-lg px-4 py-3 text-white font-mono text-sm placeholder:text-slate-700 focus:outline-none focus:border-violet-500/60 transition-colors w-full"
          />
        </div>
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
      </Field>

      <Field label="Contraseña" error={errors.password?.message}>
        <input
          {...register('password')}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      <Field label="Confirmar contraseña" error={errors.confirmPassword?.message}>
        <input
          {...register('confirmPassword')}
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      {serverError && (
        <p className="font-mono text-xs text-red-400 text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center font-mono text-xs text-slate-600">
        ¿Ya tenés cuenta?{' '}
        <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Entrar
        </a>
      </p>
    </form>
  )
}
