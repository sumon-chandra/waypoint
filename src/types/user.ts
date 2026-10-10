/**
 * User and authentication types for Waypoint
 * Strictly aligns with Prisma models in AGENTS.md Section 4.
 */

export type Role = "ADMIN" | "CUSTOMER" | "COURIER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string | null;
  displayUsername: string | null;
  password?: string | null;
  avatar: string | null;
  role: Role;
  status: UserStatus;
  googleId: string | null;
  emailVerified: boolean;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  stripeCustomerId: string | null;
  hubId: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileBody {
  name?: string;
  displayUsername?: string;
  avatar?: string;
}

export interface UpdateUserStatusBody {
  status: UserStatus;
  banReason?: string;
  banExpires?: string;
}
