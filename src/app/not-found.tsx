"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { Navbar } from "@/components/common/navbar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Centered 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Soft Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 left-1/3 size-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
          {/* Animated 404 Typography with Floating Beacon */}
          <div className="relative select-none py-4">
            <div className="text-8xl sm:text-9xl font-black tracking-tighter text-foreground flex items-center justify-center">
              <span>4</span>
              <div className="relative mx-1 sm:mx-2 flex items-center justify-center">
                <span className="text-primary animate-bounce [animation-duration:2.5s] inline-block">
                  0
                </span>
                <Compass className="absolute size-6 text-primary/40 animate-spin [animation-duration:10s] pointer-events-none" />
              </div>
              <span>4</span>
            </div>
            {/* Subtle Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-44 rounded-full border border-dashed border-primary/20 pointer-events-none animate-spin [animation-duration:30s]" />
          </div>

          {/* Headings */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
              been moved or deleted.
            </p>
          </div>

          {/* Navigation Links: Go Back and Home */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGoBack}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto rounded-xl gap-2 font-medium cursor-pointer shadow-xs hover:border-primary/40 transition-all"
              )}
            >
              <ArrowLeft className="size-4" />
              <span>Go Back</span>
            </button>

            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
              )}
            >
              <Home className="size-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
