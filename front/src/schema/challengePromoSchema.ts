import { z } from 'zod';
import { PromoDto } from './promoSchema';
import { StudentDto } from './studentSchema';

export const challengePromoSchema = z.object({
  challengePromoId: z.number(),
  challengeId: z.number(),
  promoId: z.number(),
  isOpen: z.boolean(),
})

export type ChallengePromoDto = z.infer<typeof challengePromoSchema>

export const challengePromoCreateSchema = challengePromoSchema.omit({ challengePromoId: true })
export type ChallengePromoCreateDto = z.infer<typeof challengePromoCreateSchema>

export interface ChallengePromoListDto extends ChallengePromoDto, PromoDto, StudentDto {
  challengeName: string;
  promoName: string;
}