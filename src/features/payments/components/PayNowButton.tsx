"use client";

import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { useCreateCheckoutSession } from "../api/useCreateCheckoutSession";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface PayNowButtonProps {
  shipmentId: string;
  amount?: number | null;
  label?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  disabled?: boolean;
}

export function PayNowButton({
  shipmentId,
  amount,
  label,
  variant = "default",
  size = "sm",
  className,
  disabled = false,
}: PayNowButtonProps) {
  const { mutate: createCheckoutSession, isPending } = useCreateCheckoutSession();

  const handlePay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!shipmentId || isPending) return;
    createCheckoutSession({ shipmentId });
  };

  const displayText = label
    ? label
    : amount !== undefined && amount !== null
    ? `Pay ৳${amount.toLocaleString()}`
    : "Pay Now";

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handlePay}
      disabled={disabled || isPending}
      className={cn(
        "gap-1.5 font-semibold transition-all shadow-xs cursor-pointer",
        variant === "default" && "bg-emerald-600 hover:bg-emerald-700 text-white",
        className
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <CreditCard className="size-3.5" />
          <span>{displayText}</span>
        </>
      )}
    </Button>
  );
}
