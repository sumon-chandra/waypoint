"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationMenuContextValue {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  registerItem: (id: string) => void;
  unregisterItem: (id: string) => void;
}

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu() {
  const context = React.useContext(NavigationMenuContext);
  if (!context) {
    throw new Error(
      "NavigationMenu components must be used within a <NavigationMenu />"
    );
  }
  return context;
}

interface NavigationMenuItemContextValue {
  value: string;
  isOpen: boolean;
}

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem() {
  const context = React.useContext(NavigationMenuItemContext);
  if (!context) {
    throw new Error(
      "NavigationMenuItem components must be used within a <NavigationMenuItem />"
    );
  }
  return context;
}

interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
}

export function NavigationMenu({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: NavigationMenuProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | null
  >(defaultValue || null);

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;

  const setActiveValue = React.useCallback(
    (nextValue: string | null) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      if (nextValue !== null) {
        onValueChange?.(nextValue);
      }
    },
    [isControlled, onValueChange]
  );

  const itemsRef = React.useRef<Set<string>>(new Set());

  const registerItem = React.useCallback((id: string) => {
    itemsRef.current.add(id);
  }, []);

  const unregisterItem = React.useCallback((id: string) => {
    itemsRef.current.delete(id);
  }, []);

  const navRef = React.useRef<HTMLElement>(null);

  // Close on Escape key or outside click
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveValue(null);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveValue(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveValue]);

  return (
    <NavigationMenuContext.Provider
      value={{ activeValue, setActiveValue, registerItem, unregisterItem }}
    >
      <nav
        ref={navRef}
        aria-label="Main Navigation"
        className={cn(
          "relative z-30 flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        className
      )}
      {...props}
    />
  );
}

interface NavigationMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value?: string;
}

export function NavigationMenuItem({
  value: propValue,
  className,
  children,
  ...props
}: NavigationMenuItemProps) {
  const generatedId = React.useId();
  const value = propValue || generatedId;
  const { activeValue, setActiveValue, registerItem, unregisterItem } =
    useNavigationMenu();

  const isOpen = activeValue === value;
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    registerItem(value);
    return () => unregisterItem(value);
  }, [value, registerItem, unregisterItem]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveValue(value);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveValue(null);
    }, 150);
  };

  return (
    <NavigationMenuItemContext.Provider value={{ value, isOpen }}>
      <li
        className={cn("relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-xl px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/60 data-[state=open]:text-foreground text-muted-foreground cursor-pointer"
);

interface NavigationMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps) {
  const { isOpen, value } = useNavigationMenuItem();
  const { setActiveValue } = useNavigationMenu();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    setActiveValue(isOpen ? null : value);
  };

  return (
    <button
      type="button"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      aria-haspopup="true"
      onClick={handleClick}
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "relative top-px ml-1 size-3.5 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
        aria-hidden="true"
      />
    </button>
  );
}

interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function NavigationMenuContent({
  className,
  children,
  ...props
}: NavigationMenuContentProps) {
  const { isOpen } = useNavigationMenuItem();

  if (!isOpen) return null;

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "absolute top-full left-0 mt-2.5 rounded-2xl border border-border/80 bg-card/95 p-4 text-foreground shadow-2xl backdrop-blur-2xl transition-all duration-200 z-50",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface NavigationMenuLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

export function NavigationMenuLink({
  className,
  active,
  asChild = false,
  children,
  ...props
}: NavigationMenuLinkProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      "data-active": active ? "true" : undefined,
      className: cn((children.props as any)?.className, className),
      ...props,
    });
  }

  return (
    <a
      data-active={active ? "true" : undefined}
      className={cn(
        "block select-none rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/60 hover:text-accent-foreground focus:bg-accent/60 focus:text-accent-foreground",
        active && "bg-accent/80 text-foreground font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function NavigationMenuViewport({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 flex justify-center w-full",
        className
      )}
      {...props}
    />
  );
}

export function NavigationMenuIndicator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { activeValue } = useNavigationMenu();
  if (!activeValue) return null;

  return (
    <div
      data-state={activeValue ? "visible" : "hidden"}
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-xs bg-border shadow-md" />
    </div>
  );
}
