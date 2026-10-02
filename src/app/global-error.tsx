"use client";

import * as React from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Waypoint Global Exception:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <head>
        <title>Critical Error | Waypoint Logistics</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-rose-500/30 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon */}
          <div className="relative mx-auto size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <AlertOctagon className="size-8" />
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
              <span>Root Pipeline Failure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Critical System Error
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              A catastrophic failure prevented the core application shell from loading. Telemetry has logged this event.
            </p>
          </div>

          {/* Error Details Badge */}
          {error?.digest && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Error Reference Code
              </p>
              <code className="text-xs font-mono text-rose-300 break-all select-all">
                {error.digest}
              </code>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Retry Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 px-5 py-2.5 text-sm font-medium transition-all cursor-pointer"
            >
              <Home className="size-4" />
              <span>Reload Home</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
