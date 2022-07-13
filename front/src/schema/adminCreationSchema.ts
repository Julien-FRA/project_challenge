import { z } from 'zod';

export const adminCreationSchema = z.object({
  adminId: z.number(),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/),
  pseudo: z.string().regex(/^[A-Za-z]+$/),
})

export type AdminCreateDto = z.infer<typeof adminCreationSchema>