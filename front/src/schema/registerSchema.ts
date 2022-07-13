import { z } from "zod";

export const registerSchema = z.object({
  email: z.string(),
  challengePromoId: z.number(),
  challengeId: z.number(),
  promoId: z.number(),
})
export type RegisterDto = z.infer<typeof registerSchema>

export const registerCreateSchema = registerSchema.omit({email: true})
export type RegisterCreateDto = z.infer<typeof registerCreateSchema>
