import { z } from 'zod';

export const userSchema = z.object({
  userId: z.number(),
  email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
  role: z.number().optional(),
})

export type UserDto = z.infer<typeof userSchema>

export const userCreateSchema = userSchema.omit({ userId: true })
export type UserCreateDto = z.infer<typeof userCreateSchema>

export interface UserTokenDto extends UserDto{
  promoId: number;
  challengeId: number;
}

