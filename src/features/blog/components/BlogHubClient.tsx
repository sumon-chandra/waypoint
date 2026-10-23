"use client";

import * as React from "react";
import { Search, BookOpen, Newspaper, Sparkles, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllBlogPosts,
  getFeaturedBlogPosts,
  getBlogCategories,
  type BlogPost,
} from "../data/blog-data";
import { BlogCard } from "./BlogCard";
import { FeaturedBlogHero } from "./FeaturedBlogHero";
import { cn } from "@/lib/utils";

export function BlogHubClient() {
  const allPosts = React.useMemo(() => getAllBlogPosts(), []);
  const featuredPost = React.useMemo(() => getFeaturedBlogPosts()[0] || allPosts[0], [allPosts]);
  const categories = React.useMemo(() => getBlogCategories(), []);

  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredPosts = React.useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      if (!matchesCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(q);
        const matchesTag = post.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAuthor = post.author.name.toLowerCase().includes(q);
        return matchesTitle || matchesExcerpt || matchesTag || matchesAuthor;
      }

      return true;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Featured Article Hero */}
      {featuredPost && selectedCategory === "All" && !searchQuery.trim() && (
        <section aria-label="Featured Logistics Brief">
          <FeaturedBlogHero post={featuredPost} />
        </section>
      )}

      {/* Filter Toolbar & Search */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search articles, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 rounded-2xl h-11 text-xs sm:text-sm bg-card border-border/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Pill Counter */}
        {(selectedCategory !== "All" || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <span>Showing {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}</span>
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="text-[11px] font-semibold gap-1">
                <span>{selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="text-[11px] font-semibold gap-1">
                <span>&quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </section>

      {/* Articles Grid */}
      <section aria-label="Logistics Articles Grid">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center space-y-3">
            <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <BookOpen className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                No Articles Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No published logistics briefs matched your current category or search query.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="rounded-xl text-xs cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Logistics Dispatch Digest Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-r from-primary/10 via-purple-500/5 to-card p-8 sm:p-10 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Newspaper className="size-3.5" />
              <span>Bi-Weekly Industry Intelligence</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Subscribe to Waypoint Logistics Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join 12,000+ supply chain directors, e-commerce founders, and operations leaders receiving verified freight data and regional transit briefs.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to the Waypoint Logistics Dispatch!");
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto shrink-0"
          >
            <Input
              type="email"
              required
              placeholder="Enter your work email"
              className="rounded-2xl h-11 text-xs sm:text-sm min-w-[260px] bg-background"
            />
            <Button
              type="submit"
              className="rounded-2xl h-11 px-6 font-semibold shadow-md cursor-pointer"
            >
              Subscribe Free
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
