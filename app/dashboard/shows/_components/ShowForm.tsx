'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { showSchema, type ShowInput } from '@/lib/validations/show'
import { Field, inputClass } from '@/app/dashboard/_components/Field'
import { useUploadThing } from '@/lib/uploadthing'

type Props = {
  defaultValues?: Partial<ShowInput>
  onSubmit: (data: ShowInput) => Promise<void>
  submitLabel: string
  showFlyerUpload?: boolean
}

export default function ShowForm({ defaultValues, onSubmit, submitLabel, showFlyerUpload }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShowInput>({
    resolver: zodResolver(showSchema),
    defaultValues: { festival: '', ticketUrl: '', flyerUrl: '', isSoldOut: false, ...defaultValues },
  })

  const flyerUrl = watch('flyerUrl')
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { startUpload, isUploading } = useUploadThing('djPhoto', {
    onClientUploadComplete: useCallback((res: { ufsUrl: string }[]) => {
      const url = res[0]?.ufsUrl
      if (url) setValue('flyerUrl', url, { shouldDirty: true })
    }, [setValue]),
    onUploadError: (err: Error) => setUploadError(err.message),
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
        <input {...register('festival')} className={inputClass} placeholder="Creamfields (opcional)" />
      </Field>

      <Field label="Link de tickets" error={errors.ticketUrl?.message}>
        <input {...register('ticketUrl')} className={inputClass} placeholder="https://... (opcional)" />
      </Field>

      {showFlyerUpload && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Flyer</p>
          <div className="flex items-start gap-3">
            {flyerUrl && (
              <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden shrink-0">
                <Image src={flyerUrl} alt="Flyer" fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) startUpload([file])
                    e.target.value = ''
                  }}
                />
                <span
                  className="inline-flex items-center font-mono text-xs px-3 py-2 rounded-lg transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: isUploading ? '#475569' : '#e2e8f0' }}
                >
                  {isUploading ? 'Subiendo...' : flyerUrl ? 'Cambiar flyer' : 'Subir flyer'}
                </span>
              </label>
              {flyerUrl && (
                <button
                  type="button"
                  onClick={() => setValue('flyerUrl', '', { shouldDirty: true })}
                  className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors text-left"
                >
                  Eliminar flyer
                </button>
              )}
            </div>
          </div>
          {uploadError && <p className="font-mono text-xs text-red-400">{uploadError}</p>}
          {/* hidden input to register flyerUrl in form */}
          <input type="hidden" {...register('flyerUrl')} />
        </div>
      )}

      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input {...register('isSoldOut')} type="checkbox" className="w-4 h-4 accent-violet-500 cursor-pointer" />
        <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">Sold out</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="btn-accent mt-2 text-white font-body font-medium py-3 rounded-lg"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
