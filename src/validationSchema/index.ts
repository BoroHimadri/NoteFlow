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

export const documentSchema = z.object({
  id: z.uuid(),
  title: z.string().min(3, "Title is too short"),
  content: z.string().optional(),
  user_id: z.uuid(),
  created_at: z.string(),
});

// Use THIS for your POST request validation
export const createDocumentSchema = documentSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
