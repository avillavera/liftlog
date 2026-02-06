import { z } from "zod";

/**
 * Standard Email Regex:
 * Checks for: text + @ + text + . + text
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, { message: "Invalid email address" })
    .max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72),
});

export const loginSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, { message: "Invalid email address" })
    .max(255),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;