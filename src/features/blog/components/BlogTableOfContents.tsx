"use client";

import * as React from "react";
import { List, Check } from "lucide-react";
import type { BlogTableOfContentsItem } from "../data/blog-data";
import { cn } from "@/lib/utils";

interface BlogTableOfContentsProps {
  items: BlogTableOfContentsItem[];
}

export function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <List className="size-4 text-primary shrink-0" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Table of Contents
        </h4>
      </div>

      <nav aria-label="Table of contents">
        <ul className="space-y-1.5 text-xs">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={cn(
                    "block py-1.5 px-3 rounded-xl transition-all leading-relaxed",
                    isActive
                      ? "bg-primary/10 text-primary font-bold border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
