"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, Home, ArrowLeft, LifeBuoy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    console.error("Waypoint Root Application Error:", error);
  }, [error]);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-destructive/25 bg-card/95 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-56 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="relative mx-auto size-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center shadow-lg shadow-destructive/10">
          <AlertTriangle className="size-8" />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
            <span>Runtime Anomaly Caught</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            An unexpected error interrupted this page. Our infrastructure monitoring service has flagged the anomaly.
          </p>
        </div>

        {/* Error Code Diagnostic */}
        {error?.digest && (
          <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-left">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Diagnostic Code
            </p>
            <code className="text-xs font-mono text-foreground break-all select-all">
              {error.digest}
            </code>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-xs cursor-pointer"
            )}
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={handleGoBack}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-medium cursor-pointer"
            )}
          >
            <ArrowLeft className="size-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full sm:w-auto rounded-xl gap-2 font-medium"
            )}
          >
            <Home className="size-4" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <span>Need technical assistance? </span>
          <Link href="/contact" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
            <LifeBuoy className="size-3.5" />
            <span>Contact Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
