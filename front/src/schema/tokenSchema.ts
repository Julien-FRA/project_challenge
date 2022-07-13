import { z } from 'zod';

export const tokenSchema = z.object({
  email: z.string().regex(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/i)
})

export type TokenDto = z.infer<typeof tokenSchema>
