import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          data-slot="select"
          className={cn(
            "h-10 w-full appearance-none rounded-xl border border-input bg-background/60 px-3.5 pr-9 py-2 text-sm text-foreground shadow-2xs transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer",
            error && "border-destructive focus-visible:ring-destructive/30",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-transform" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
