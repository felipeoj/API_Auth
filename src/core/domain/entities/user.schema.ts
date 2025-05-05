import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from './user-role.enum';

export const UserSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  isEmailVerified: z.boolean().default(false),
  twoFactorSecret: z.string().nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  deletedAt: z.date().optional(),
  userRole: z.nativeEnum(UserRole).default(UserRole.USER),
  isTwoFactorEnabled: z.boolean().default(false),
});
export type User = z.infer<typeof UserSchema>;
