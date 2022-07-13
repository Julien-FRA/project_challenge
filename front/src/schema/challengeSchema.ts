import { z } from 'zod';

export const challengeSchema = z.object({
  challengeId: z.number(),
  challengeName: z.string().min(3),
  publicKey: z.string().min(3),
})

export type ChallengeDto = z.infer<typeof challengeSchema>

export const challengeCreateSchema = challengeSchema.omit({challengeId: true})
export type ChallengeCreateDto = z.infer<typeof challengeCreateSchema>