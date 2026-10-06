"use client";

import * as React from "react";
import {
  Users,
  Search,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Inbox,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsers } from "../../api/useUsers";
import { UpdateUserStatusModal } from "./UpdateUserStatusModal";
import type { User, Role, UserStatus } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_BADGES: Record<Role, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  COURIER: {
    label: "Courier Rider",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  CUSTOMER: {
    label: "Customer",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

const STATUS_BADGES: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  BANNED: {
    label: "Banned",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function UserManagementTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  // Status modal state
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useUsers({
    role: roleFilter === "ALL" ? undefined : roleFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 100,
  });

  const users = data?.users ?? [];

  // Client-side search
  const filteredUsers = React.useMemo(() => {
    let list = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.username && u.username.toLowerCase().includes(q))
      );
    }
    return list;
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search accounts by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl h-11 text-xs sm:text-sm"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-36">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="COURIER">Couriers</option>
              <option value="ADMIN">Admins</option>
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl h-11 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BANNED">Banned</option>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="rounded-2xl size-11 shrink-0 cursor-pointer"
            title="Refresh users"
          >
            <RotateCw
              className={cn("size-4", isRefetching && "animate-spin text-primary")}
            />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground animate-pulse">
          Loading user accounts directory...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-4">
          <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              No User Accounts Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No accounts matched your search "${searchQuery}".`
                : "No registered accounts found under this filter selection."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="rounded-xl text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">User Account</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {filteredUsers.map((u) => {
                  const roleInfo = ROLE_BADGES[u.role] || {
                    label: u.role,
                    className: "bg-muted text-muted-foreground",
                  };
                  const statusInfo = STATUS_BADGES[u.status] || {
                    label: u.status,
                    className: "bg-muted text-muted-foreground",
                  };

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 rounded-xl border">
                            <AvatarImage src={u.avatar || undefined} />
                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                              {u.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-0.5">
                            <p className="font-bold text-foreground text-sm truncate">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] font-bold py-0.5", roleInfo.className)}
                        >
                          {roleInfo.label}
                        </Badge>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] font-bold py-0.5", statusInfo.className)}
                          >
                            {statusInfo.label}
                          </Badge>
                          {u.status === "BANNED" && u.banReason && (
                            <p className="text-[10px] text-destructive truncate max-w-xs">
                              {u.banReason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Email Verification */}
                      <td className="py-4 px-4">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                            <XCircle className="size-3.5" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-muted-foreground text-[11px] font-mono">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(u)}
                          className="rounded-xl h-7 px-2.5 text-[11px] font-bold gap-1 cursor-pointer"
                        >
                          <ShieldAlert className="size-3" />
                          <span>Manage</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status / Ban Management Modal */}
      {selectedUser && (
        <UpdateUserStatusModal
          user={selectedUser}
          open={Boolean(selectedUser)}
          onOpenChange={(open) => {
            if (!open) setSelectedUser(null);
          }}
          onSuccess={() => {
            setSelectedUser(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
