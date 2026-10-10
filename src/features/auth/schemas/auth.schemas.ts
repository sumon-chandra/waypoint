import { z } from "zod";

export const registerRoleEnum = z.enum(["CUSTOMER", "COURIER"]);
export type RegisterRole = z.infer<typeof registerRoleEnum>;

export const roleEnum = z.enum(["CUSTOMER", "COURIER", "ADMIN"]);
export type Role = z.infer<typeof roleEnum>;

export const loginSchema = z.object({
  email: z
    .string("Email address cannot be empty")
    .trim()
    .min(1, "Email address cannot be empty")
    .email("Please enter a valid email address"),
  password: z
    .string("Password cannot be empty")
    .min(1, "Password cannot be empty"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: registerRoleEnum,
    fullName: z
      .string("Full name cannot be empty")
      .trim()
      .min(1, "Full name cannot be empty"),
    email: z
      .string("Email address cannot be empty")
      .trim()
      .min(1, "Email address cannot be empty")
      .email("Please enter a valid email address"),
    phone: z
      .string("Phone number cannot be empty")
      .trim()
      .regex(
        /^01[3-9]\d{8}$/,
        "Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX)",
      ),
    password: z
      .string("Password cannot be empty")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string("Please confirm your password")
      .min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms of Service to continue"),
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
  avatarUrl?: string;
  avatar?: string;
  phone?: string;
  username?: string | null;
  displayUsername?: string | null;
  emailVerified?: boolean;
  hubId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoogleAuthPayload {
  code?: string;
  idToken?: string;
  role?: RegisterRole;
}

export interface GoogleAuthUrlData {
  url?: string;
  redirectUrl?: string;
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
