import { z } from "zod";

export const emailSchema = z
  .email("Please enter a valid email address")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter required")
  .regex(/[a-z]/, "One lowercase letter required")
  .regex(/[0-9]/, "One number required");

export const loginSchema = z.object({
  email: emailSchema,

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

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;