import { z } from 'zod'

const uploadedFileUrl = z.union([
  z.literal(''),
  z.string().url('URL inválida'),
  z.string().regex(/^\/uploads\//, 'URL inválida'),
])

export const showSchema = z.object({
  date:      z.string().min(1, 'La fecha es requerida'),
  venue:     z.string().min(1, 'El venue es requerido').max(100),
  city:      z.string().min(1, 'La ciudad es requerida').max(100),
  country:   z.string().min(1, 'El país es requerido').max(100),
  address:   z.string().max(200),
  festival:  z.string().max(100),
  ticketUrl: z.union([z.literal(''), z.string().url('URL inválida')]),
  flyerUrl:  uploadedFileUrl,
  isSoldOut: z.boolean(),
})

export type ShowInput = z.infer<typeof showSchema>
