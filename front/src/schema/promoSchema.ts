import { z } from 'zod';

export const promoSchema = z.object({
  promoId: z.number(),
  promoName: z.string().min(2),
})

export type PromoDto = z.infer<typeof promoSchema>

export const promoCreateSchema = promoSchema.omit({promoId: true})
export type PromoCreateDto = z.infer<typeof promoCreateSchema>