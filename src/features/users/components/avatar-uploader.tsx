"use client";

import * as React from "react";
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface AvatarUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  userName?: string;
  disabled?: boolean;
}

export function AvatarUploader({
  value,
  onChange,
  userName = "User",
  disabled = false,
}: AvatarUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: (res) => {
      setUploadProgress(100);
      if (res && res.length > 0) {
        const uploadedUrl = res[0].ufsUrl || res[0].url;
        onChange(uploadedUrl);
        setLocalPreview(null);
        toast.success("Avatar uploaded successfully", {
          description: "Your new profile picture has been processed.",
        });
      }
    },
    onUploadError: (error: Error) => {
      setUploadProgress(0);
      // Helpful error messaging for developer if UploadThing token is not set
      const isConfigError =
        error.message.includes("token") ||
        error.message.includes("Unauthorized") ||
        error.message.includes("Missing");

      toast.error("Upload failed", {
        description: isConfigError
          ? "UploadThing token may not be configured in .env.local. Please check your setup."
          : error.message || "Failed to upload image. Please try again.",
      });
    },
  });

  const activeAvatar = localPreview || value || "";
  const firstChar = userName.trim()
    ? userName.trim().charAt(0).toUpperCase()
    : "U";

  // Validate and initiate upload
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled || isUploading) return;

    const file = files[0];

    // Client-side file type verification
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please select a JPG, PNG, WebP, or GIF image.",
      });
      return;
    }

    // Client-side file size verification (4MB limit)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File exceeds limit", {
        description: "Image size must be less than 2MB.",
      });
      return;
    }

    // Generate immediate client preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploadProgress(10);

    try {
      await startUpload([file]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error initiating upload";
      toast.error("Upload error", { description: msg });
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    onChange("");
    setLocalPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Avatar Display Circle */}
        <div className="relative shrink-0 self-center sm:self-auto">
          <div className="rounded-full ring-4 ring-card bg-card shadow-md p-1">
            <Avatar
              size="lg"
              className="size-20 sm:size-24 border border-border"
            >
              {activeAvatar ? (
                <AvatarImage
                  src={activeAvatar}
                  alt={userName}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-primary/15 text-primary text-2xl font-bold">
                {firstChar}
              </AvatarFallback>
            </Avatar>
          </div>

          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-background/80 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="size-6 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Dropzone / Upload Action Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "flex-1 flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer select-none",
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border/80 hover:border-primary/60 hover:bg-muted/30",
            disabled && "opacity-50 pointer-events-none",
          )}
          onClick={() => {
            if (!disabled && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled || isUploading}
          />

          <div className="flex flex-col items-center gap-1.5">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <UploadCloud className="size-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              {isUploading ? (
                <span className="text-primary flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" /> Uploading to
                  UploadThing...
                </span>
              ) : (
                <>
                  <span className="text-primary font-bold">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">
              PNG, JPG, WebP or GIF (max. 2MB)
            </p>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full max-w-xs mt-3 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Remove avatar button if avatar exists */}
      {activeAvatar && !isUploading && (
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-500" />
            Custom avatar set
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs gap-1"
          >
            <X className="size-3" />
            <span>Remove photo</span>
          </Button>
        </div>
      )}
    </div>
  );
}
