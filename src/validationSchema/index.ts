import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
