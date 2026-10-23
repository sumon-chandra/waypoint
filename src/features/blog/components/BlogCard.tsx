import * as React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogPost } from "../data/blog-data";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const getCategoryColor = (category: BlogPost["category"]) => {
    switch (category) {
      case "Logistics Tech":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Supply Chain":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Cold Chain":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "E-Commerce":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Fleet Management":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {/* Top Meta info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs font-semibold px-2.5 py-0.5", getCategoryColor(post.category))}
          >
            {post.category}
          </Badge>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {/* Bottom Meta & Author */}
      <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-8 border border-border/80 shrink-0">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="text-xs font-bold">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {post.author.name}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="size-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="size-4" />
        </div>
      </div>
    </article>
  );
}
