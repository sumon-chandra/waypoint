import { cn } from "@/lib/utils";
import { Check, LucideIcon } from "lucide-react";
import React from "react";

type Stage = {
  id: number;
  title: string;
  label: string;
  icon: LucideIcon;
};

interface FormHeaderStageButtonProps {
  stage: Stage;
  idx: number;
  currentStage: number;
  isCompleted: boolean;
  isCurrent: boolean;
  setCurrentStage: React.Dispatch<React.SetStateAction<number>>;
}

export const FormHeaderStageButton = ({
  stage,
  idx,
  currentStage,
  isCompleted,
  isCurrent,
  setCurrentStage,
}: FormHeaderStageButtonProps) => {
  return (
    <button
      key={stage.id}
      type="button"
      onClick={() => {
        // Only allow jumping back to previously completed stages
        if (idx < currentStage) {
          setCurrentStage(idx);
        }
      }}
      disabled={idx > currentStage}
      className={cn(
        "flex items-center gap-3 p-3 rounded-2xl border text-left transition-all select-none",
        isCurrent &&
          "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20",
        isCompleted &&
          "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer",
        !isCurrent &&
          !isCompleted &&
          "border-border/60 bg-muted/20 opacity-60 cursor-not-allowed",
      )}
    >
      <div
        className={cn(
          "size-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors",
          isCurrent && "bg-primary text-primary-foreground",
          isCompleted && "bg-emerald-500 text-white",
          !isCurrent && !isCompleted && "bg-muted text-muted-foreground",
        )}
      >
        {isCompleted ? <Check className="size-4" /> : idx + 1}
      </div>
      <div className="min-w-0">
        <span
          className={cn(
            "block text-xs font-bold leading-tight truncate",
            isCurrent && "text-primary",
            isCompleted && "text-foreground",
            !isCurrent && !isCompleted && "text-muted-foreground",
          )}
        >
          {stage.title}
        </span>
        <span className="block text-[10px] text-muted-foreground truncate">
          {stage.label}
        </span>
      </div>
    </button>
  );
};
