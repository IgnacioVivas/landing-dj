'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

const inputClass =
  'bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm placeholder:text-slate-700 focus:outline-none focus:border-violet-500/60 transition-colors w-full'

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const justRegistered = params.get('registered') === '1'
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError('Email o contraseña incorrectos.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {justRegistered && (
        <p className="font-mono text-xs text-cyan-400 text-center">
          Cuenta creada. Ingresá con tus datos.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs text-slate-500 tracking-widest uppercase">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className={inputClass}
        />
        {errors.email && (
          <p className="font-mono text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs text-slate-500 tracking-widest uppercase">
          Contraseña
        </label>
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
        />
        {errors.password && (
          <p className="font-mono text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p className="font-mono text-xs text-red-400 text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-center font-mono text-xs text-slate-600">
        ¿No tenés cuenta?{' '}
        <a href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
          Crear una
        </a>
      </p>
    </form>
  )
}
