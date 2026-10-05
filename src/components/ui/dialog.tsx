"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog />");
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const nextValue = typeof value === "function" ? value(open) : value;
      if (!isControlled) {
        setUncontrolledOpen(nextValue);
      }
      onOpenChange?.(nextValue);
    },
    [isControlled, open, onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  className,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { setOpen } = useDialog();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  hideCloseButton?: boolean;
}

function DialogContent({
  children,
  className,
  onClose,
  hideCloseButton = false,
  ...props
}: DialogContentProps) {
  const { open, setOpen } = useDialog();

  const handleClose = React.useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [setOpen, onClose]);

  // Lock body scroll and handle Escape key
  React.useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 duration-200 sm:p-7 max-h-[90vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-left pb-4", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg sm:text-xl font-bold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4 border-t border-border/60", className)}
      {...props}
    />
  );
}

function DialogClose({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog();

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
