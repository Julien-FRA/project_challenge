import { z } from 'zod';

export const adminSchema = z.object({
  adminId: z.number(),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/),
  pseudo: z.string().regex(/^[A-Za-z]+$/),
})

export type AdminDto = z.infer<typeof adminSchema>

export const adminCreateSchema = adminSchema.omit({adminId: true})
export type AdminCreateDto = z.infer<typeof adminCreateSchema>