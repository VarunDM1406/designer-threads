import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name is required")
      .max(50),

    lastName: z
      .string()
      .min(2, "Last name is required")
      .max(50),

    email: z
      .email("Please enter a valid email address")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[a-z]/, "One lowercase letter required")
      .regex(/[0-9]/, "One number required"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;