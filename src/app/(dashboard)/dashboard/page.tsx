"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

/**
 * Smart Dashboard Gateway
 * Seamlessly inspects the authenticated user's role and forwards to their respective portal:
 * - ADMIN    -> /admin
 * - COURIER  -> /courier
 * - CUSTOMER -> /customer
 */
export default function DashboardGatewayPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    switch (user.role) {
      case "ADMIN":
        router.replace("/admin");
        break;
      case "COURIER":
        router.replace("/courier");
        break;
      case "CUSTOMER":
      default:
        router.replace("/customer");
        break;
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Routing to your command center...
        </p>
      </div>
    </div>
  );
}
