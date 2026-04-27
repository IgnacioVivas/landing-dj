import { z } from 'zod'

export const createDjSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  djName:   z.string().min(1, 'Requerido'),
  slug:     z.string().min(1, 'Requerido').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  months:   z.coerce.number().int().min(1).max(24),
  notes:    z.string().optional(),
})

export const updateSubscriptionSchema = z.object({
  userId:    z.string().min(1),
  status:    z.enum(['ACTIVE', 'EXPIRED', 'SUSPENDED']),
  startDate: z.string().min(1),
  expiresAt: z.string().min(1),
  notes:     z.string().optional(),
})

export const updateDjInfoSchema = z.object({
  userId: z.string().min(1),
  djName: z.string().min(1, 'Requerido'),
  email:  z.string().email('Email inválido'),
  slug:   z.string().min(1).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
})

export type CreateDjInput        = z.infer<typeof createDjSchema>
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>
export type UpdateDjInfoInput    = z.infer<typeof updateDjInfoSchema>
