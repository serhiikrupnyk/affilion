import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(), // на майбутнє (user profile)
  role: z.enum(["admin", "manager", "viewer"]).optional(),
});
export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignInInput = z.infer<typeof SignInSchema>;
