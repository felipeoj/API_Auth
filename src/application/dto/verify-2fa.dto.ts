import { z } from 'zod';

export const Verify2FASchema = z.object({
  code: z.string().length(6, 'O código 2FA deve ter exatamente 6 dígitos'),
});

export type Verify2FADto = z.infer<typeof Verify2FASchema>;
