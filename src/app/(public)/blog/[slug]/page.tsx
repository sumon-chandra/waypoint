import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  Truck,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/features/blog/data/blog-data";
import { BlogTableOfContents } from "@/features/blog/components/BlogTableOfContents";
import { BlogAuthorCard } from "@/features/blog/components/BlogAuthorCard";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found — Waypoint Blog",
    };
  }

  return {
    title: `${post.title} — Waypoint Logistics Insights`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(slug);
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />
            <Link
              href="/blog"
              className="hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/50 shrink-0" />
            <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">
              {post.category}
            </span>
          </nav>

          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "ghost", size: "xs" }),
              "rounded-xl gap-1.5 text-xs self-start sm:self-auto cursor-pointer"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Article Header Hero */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              variant="outline"
              className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20"
            >
              {post.category}
            </Badge>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>{post.readTime}</span>
            </div>

            <span className="text-muted-foreground/40">•</span>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>Published on {formattedDate}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Main Layout: Left Content (65%), Right Sticky Sidebar (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
          {/* Main Article Body */}
          <main className="lg:col-span-8 space-y-10">
            {post.content.map((section) => (
              <section
                key={section.sectionId}
                id={section.sectionId}
                className="scroll-mt-24 space-y-4"
              >
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground border-b border-border/40 pb-2">
                  {section.sectionTitle}
                </h2>

                <div className="space-y-3.5 text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
                  {section.paragraphs.map((p, pIndex) => (
                    <p key={pIndex}>{p}</p>
                  ))}
                </div>

                {/* Callout Box if present */}
                {section.callout && (
                  <div
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm my-6 space-y-1.5 backdrop-blur-xs",
                      section.callout.type === "stat"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
                        : section.callout.type === "tip"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100"
                        : "border-primary/30 bg-primary/10 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      {section.callout.type === "stat" ? (
                        <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : section.callout.type === "tip" ? (
                        <CheckCircle2 className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="size-4 text-primary shrink-0" />
                      )}
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.callout.text}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Tags Strip */}
            <div className="pt-6 border-t border-border/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Tag className="size-3.5" />
                <span>Tagged Logistics Subjects:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-3 py-1 font-medium bg-muted/60"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </main>

          {/* Sticky Aside Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <BlogTableOfContents items={post.tableOfContents} />

              {/* Author Card */}
              <BlogAuthorCard author={post.author} />

              {/* Waypoint Freight Telemetry Ad / Widget */}
              <div className="rounded-2xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Truck className="size-4" />
                  <span>Integrated Freight Network</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Ship Consignments with Waypoint
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect your business directly to 64 districts with automated OTP verification and 24-hour COD remittance.
                </p>
                <div className="pt-2">
                  <Link
                    href="/pricing"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full rounded-xl text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                    )}
                  >
                    View Platform Rates
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Read Next Section */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-border/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Recommended Logistics Briefs
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Continue exploring technical perspectives across the Waypoint editorial network.
                </p>
              </div>

              <Link
                href="/blog"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
