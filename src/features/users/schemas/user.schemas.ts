import { z } from "zod";
import { Role } from "@/features/auth/schemas/auth.schemas";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | string;

/**
 * Full User Profile contract matching Prisma database model:
 * 
 * model User {
 *   name            String
 *   email           String     @unique
 *   username        String?    @unique
 *   displayUsername String?
 *   password        String?
 *   avatar          String?
 *   role            Role       @default(CUSTOMER)
 *   status          UserStatus @default(ACTIVE)
 *   googleId        String?    @unique
 *   emailVerified   Boolean    @default(false)
 *   banned          Boolean?   @default(false)
 *   banReason       String?
 *   banExpires      DateTime?
 * }
 */
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  username?: string | null;
  displayUsername?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  role: Role;
  status: UserStatus;
  googleId?: string | null;
  emailVerified: boolean;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: string | Date | null;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Validation Schema for updating profile information
 */
export const updateProfileSchema = z.object({
  name: z
    .string("Full name cannot be empty")
    .trim()
    .min(1, "Full name cannot be empty")
    .max(60, "Full name cannot exceed 60 characters"),
  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_]{3,30}$|^$/,
      "Username can only contain letters, numbers, and underscores (3-30 characters)"
    )
    .optional()
    .or(z.literal("")),
  displayUsername: z
    .string()
    .trim()
    .max(40, "Display name cannot exceed 40 characters")
    .optional()
    .or(z.literal("")),
  avatar: z
    .string()
    .trim()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/i.test(val),
      "Avatar must be a valid image URL starting with http:// or https://"
    )
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

/**
 * Validation Schema for updating password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string("Current password cannot be empty")
      .min(1, "Please enter your current password"),
    newPassword: z
      .string("New password cannot be empty")
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string("Please confirm your new password")
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * API Payloads & Responses
 */
export interface UpdateProfilePayload {
  name: string;
  username?: string | null;
  displayUsername?: string | null;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  password?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: UserProfile | { user: UserProfile };
}
