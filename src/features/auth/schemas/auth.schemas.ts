import { z } from "zod";

export const registerRoleEnum = z.enum(["CUSTOMER", "COURIER"]);
export type RegisterRole = z.infer<typeof registerRoleEnum>;

export const roleEnum = z.enum(["CUSTOMER", "COURIER", "ADMIN"]);
export type Role = z.infer<typeof roleEnum>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: registerRoleEnum,
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^01[3-9]\d{8}$/,
        "Must be a valid 11-digit BD mobile number (e.g. 01712345678)",
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms of Service"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Backend API Payload and Response contracts
 */
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
  phone?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}
