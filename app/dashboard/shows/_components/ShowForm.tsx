'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSchema, type ShowInput } from '@/lib/validations/show'
import { Field, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  defaultValues?: Partial<ShowInput>
  onSubmit: (data: ShowInput) => Promise<void>
  submitLabel: string
}

export default function ShowForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShowInput>({
    resolver: zodResolver(showSchema),
    defaultValues: { festival: '', ticketUrl: '', isSoldOut: false, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Fecha" error={errors.date?.message}>
        <input {...register('date')} type="date" className={inputClass} />
      </Field>

      <Field label="Venue" error={errors.venue?.message}>
        <input {...register('venue')} className={inputClass} placeholder="Club Name" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ciudad" error={errors.city?.message}>
          <input {...register('city')} className={inputClass} placeholder="Buenos Aires" />
        </Field>
        <Field label="País" error={errors.country?.message}>
          <input {...register('country')} className={inputClass} placeholder="Argentina" />
        </Field>
      </div>

      <Field label="Festival" error={errors.festival?.message}>
        <input
          {...register('festival')}
          className={inputClass}
          placeholder="Creamfields (opcional)"
        />
      </Field>

      <Field label="Link de tickets" error={errors.ticketUrl?.message}>
        <input
          {...register('ticketUrl')}
          className={inputClass}
          placeholder="https://... (opcional)"
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input
          {...register('isSoldOut')}
          type="checkbox"
          className="w-4 h-4 accent-violet-500 cursor-pointer"
        />
        <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">
          Sold out
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
