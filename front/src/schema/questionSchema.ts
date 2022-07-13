import { z } from 'zod';

export const questionSchema = z.object({
  questionId: z.number(),
  challengeId: z.number(),
  textQuestion: z.string(),
  commandQuestion:z.string(),
  expectedAnswer: z.string(),
  scoreQuestion: z.number()
})

export type QuestionDto = z.infer<typeof questionSchema>

export const questionCreateSchema = questionSchema.omit({questionId: true})
export type QuestionCreateDto = z.infer<typeof questionCreateSchema>


export const questionInputSchema = z.object({
  questionId: z.number(),
  challengeId: z.string(),
  textQuestion: z.string(),
  commandQuestion:z.string(),
  expectedAnswer: z.string(),
  scoreQuestion: z.string()
})
export type QuestionInputDto = z.infer<typeof questionSchema>
