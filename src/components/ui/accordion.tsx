"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

function Accordion({
  children,
  className,
  type = "single",
  defaultValue,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (type === "single") {
          return prev.includes(id) ? [] : [id];
        }
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      });
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("space-y-2.5", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean } | null>(null);

function AccordionItem({ value, children, className, ...props }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs transition-all overflow-hidden",
          isOpen && "border-primary/30 bg-card/90 shadow-xs",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleItem } = useAccordion();
  const item = React.useContext(AccordionItemContext);

  if (!item) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  return (
    <button
      type="button"
      onClick={() => toggleItem(item.value)}
      aria-expanded={item.isOpen}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-foreground transition-colors hover:text-primary cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          item.isOpen && "rotate-180 text-primary"
        )}
      />
    </button>
  );
}

function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const item = React.useContext(AccordionItemContext);

  if (!item) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  if (!item.isOpen) return null;

  return (
    <div
      className={cn(
        "px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
