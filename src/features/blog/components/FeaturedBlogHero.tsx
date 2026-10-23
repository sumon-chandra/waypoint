import * as React from "react";
import Link from "next/link";
import { Sparkles, Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import type { BlogPost } from "../data/blog-data";
import { cn } from "@/lib/utils";

interface FeaturedBlogHeroProps {
  post: BlogPost;
}

export function FeaturedBlogHero({ post }: FeaturedBlogHeroProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:border-primary/50">
      {/* Decorative gradient backdrops */}
      <div className="absolute -right-20 -top-20 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 size-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-3xl">
          {/* Header pill strip */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>Featured Logistics Brief</span>
            </span>

            <Badge
              variant="outline"
              className="text-xs font-semibold border-border/80 bg-background/50"
            >
              {post.category}
            </Badge>

            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
              <Clock className="size-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors focus:outline-none"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & CTA Row */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/60">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border-2 border-primary/20 shrink-0">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="font-bold">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {post.author.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.author.role}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "rounded-2xl gap-2 shadow-lg shadow-primary/20 font-semibold self-start sm:self-auto cursor-pointer"
              )}
            >
              <BookOpen className="size-4" />
              <span>Read Full Analysis</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
