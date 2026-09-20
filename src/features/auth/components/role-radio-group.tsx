import * as React from "react";
import { User, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RegisterRole } from "../schemas/auth.schemas";

interface RoleRadioGroupProps {
  value: RegisterRole;
  onChange: (value: RegisterRole) => void;
  className?: string;
  name?: string;
}

export function RoleRadioGroup({
  value,
  onChange,
  className,
  name = "auth-role",
}: RoleRadioGroupProps) {
  const roles: {
    id: RegisterRole;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "CUSTOMER",
      label: "Customer / Merchant",
      description: "Send parcels, track consignments & manage COD",
      icon: User,
    },
    {
      id: "COURIER",
      label: "Courier Partner",
      description: "Deliver packages, view routes & manage earnings",
      icon: Truck,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Account Role Selection"
      className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}
    >
      {roles.map((role) => {
        const isSelected = value === role.id;
        const Icon = role.icon;

        return (
          <label
            key={role.id}
            htmlFor={`${name}-${role.id}`}
            className={cn(
              "relative flex flex-col p-3.5 rounded-xl border cursor-pointer select-none transition-all",
              isSelected
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                : "border-border bg-card/60 hover:bg-muted/40 hover:border-border/80"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {role.label}
                  </span>
                </div>
              </div>

              {/* Custom Accessible Radio Circle */}
              <div className="relative flex items-center justify-center pt-0.5">
                <input
                  type="radio"
                  id={`${name}-${role.id}`}
                  name={name}
                  value={role.id}
                  checked={isSelected}
                  onChange={() => onChange(role.id)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "size-4 rounded-full border transition-all flex items-center justify-center",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40 bg-background"
                  )}
                >
                  {isSelected && (
                    <div className="size-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground leading-normal pl-0.5">
              {role.description}
            </p>
          </label>
        );
      })}
    </div>
  );
}

export default RoleRadioGroup;
