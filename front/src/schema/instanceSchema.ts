import { z } from 'zod';

export const instanceSchema = z.object({
  challengeId: z.number(),
  studentId: z.number(),
  addressIp: z.string().regex(/(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/i),
  port: z.number(),
  username: z.string().regex(/^[a-z ,.'-]+$/i)
})
export type InstanceDto = z.infer<typeof instanceSchema>

export const instanceCreateSchema = instanceSchema
export type InstanceCreateDto = z.infer<typeof instanceCreateSchema>