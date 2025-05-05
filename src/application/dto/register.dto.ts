import { z } from 'zod';

export const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
