import { z } from 'zod';

export const studentSchema = z.object({
  studentId: z.number(),
  promoId: z.number(),
  familyName: z.string().regex(/^[a-z ,.'-]+$/i),
  givenName: z.string().regex(/^[a-z ,.'-]+$/i),
  rating: z.number().optional(),
})

export type StudentDto = z.infer<typeof studentSchema>