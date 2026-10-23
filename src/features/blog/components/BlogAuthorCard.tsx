import * as React from "react";
import { User, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogAuthor } from "../data/blog-data";

interface BlogAuthorCardProps {
  author: BlogAuthor;
}

export function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <User className="size-4 text-primary shrink-0" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          About the Author
        </h4>
      </div>

      <div className="flex items-start gap-3">
        <Avatar className="size-12 border-2 border-primary/20 shrink-0">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="font-bold">
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-foreground">{author.name}</p>
            <ShieldCheck className="size-3.5 text-primary" />
          </div>
          <p className="text-xs font-medium text-primary/90">{author.role}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
        {author.bio}
      </p>
    </div>
  );
}
