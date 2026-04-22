import { z } from 'zod'

const optionalUrl = z.union([z.literal(''), z.string().url('URL inválida')])

export const releaseSchema = z.object({
  title:         z.string().min(1, 'El título es requerido').max(100),
  type:          z.enum(['album', 'ep', 'single']),
  year:          z.number().int().min(1970, 'Año inválido').max(new Date().getFullYear() + 1, 'Año inválido'),
  label:         z.string().max(100),
  coverGradient: z.string().min(1),
  spotifyUrl:    optionalUrl,
  soundcloudUrl: optionalUrl,
  appleMusicUrl: optionalUrl,
  beatportUrl:   optionalUrl,
})

export type ReleaseInput = z.infer<typeof releaseSchema>
