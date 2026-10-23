"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  Package,
  Clock,
  Banknote,
  Building2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    label: "📦 Track Consignment",
    prompt: "How do I track my consignment WP-849201?",
  },
  {
    label: "💰 Rate to Sylhet",
    prompt: "What is the delivery rate for a 2kg parcel from Dhaka to Sylhet?",
  },
  {
    label: "💳 How COD Works",
    prompt: "How does Waypoint's 1% Cash on Delivery (COD) payout work?",
  },
  {
    label: "⏰ Hub Cutoff Times",
    prompt:
      "What are the daily counter drop-off cutoffs for next-day dispatch?",
  },
  {
    label: "🚀 Same-Day Metro",
    prompt: "Can I send urgent corporate documents same-day within Dhaka?",
  },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content: `Hello! I am your **Waypoint AI Logistics Copilot**, powered by NVIDIA Nemotron 3.5.

I can help you with:
* **Consignment tracking** across all 64 districts
* **Shipping rates & transit SLAs**
* **1% Cash on Delivery (COD)** automated payouts
* **Hub locations & daily 18:00 cutoff hours**

How can I assist your logistics today?`,
  timestamp: "Just now",
};

/**
 * Lightweight safe markdown renderer for chat responses
 */
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-foreground/90 break-words">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // H3 Header (### Header)
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              className="text-xs font-bold text-foreground mt-2 mb-1 flex items-center gap-1.5 text-primary"
            >
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }

        // Bullet point (* item or - item)
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const itemText = trimmed.replace(/^[\*\-]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5">
              <span className="size-1 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>{renderInlineMarkdown(itemText)}</span>
            </div>
          );
        }

        // Standard line
        return <p key={idx}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

/**
 * Formats bold text, code snippets, and internal links
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  // Regex splitting by bold (**text**), code (`code`), or links ([text](url))
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      // If looks like a tracking link WP-...
      if (/^WP-?\d+/i.test(code)) {
        return (
          <Link
            key={i}
            href={`/track/${code}`}
            className="inline-flex items-center gap-0.5 font-mono text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-1 py-0.5 rounded transition-colors"
          >
            <span>{code}</span>
            <ExternalLink className="size-2.5 inline" />
          </Link>
        );
      }
      return (
        <code
          key={i}
          className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1 py-0.5 rounded"
        >
          {code}
        </code>
      );
    }
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <Link
            key={i}
            href={match[2]}
            className="text-primary underline font-medium hover:text-primary/80"
          >
            {match[1]}
          </Link>
        );
      }
    }
    return part;
  });
}

export function WaypointAiCopilot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opening
  React.useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history for API
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-msg")
        .concat(userMessage)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          prompt: text,
        }),
      });

      const data = await res.json();
      const replyText =
        data?.reply ||
        "I apologize, but I could not retrieve an answer at this moment. Please call our 24/7 hotline at 09612-WAYPOINT.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("[Waypoint AI] Failed to communicate with chat API:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `I encountered a momentary connection interruption. You can track consignments directly at [/track](/track) or contact our operations team at **09612-WAYPOINT**.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "group relative flex items-center gap-2.5 rounded-full px-4 py-3 shadow-xl transition-all duration-300",
            "hover:shadow-2xl hover:scale-105 active:scale-95",
            "border border-border hover:border-primary/40 cursor-pointer bg-background",
          )}
          aria-label="Open Waypoint AI Logistics Copilot"
        >
          <div className="relative flex items-center justify-center size-7 backdrop-blur-xs">
            <Bot className="size-6 text-primary animate-spin-slow" />
          </div>

          <div className="relative text-left hidden sm:block">
            <p className="text-xs font-bold tracking-tight leading-tight flex items-center gap-1.5">
              <span>Waypoint AI</span>
            </p>
            <p className="text-[10px] text-white/80 leading-tight">
              Logistics Copilot
            </p>
          </div>

          {/* Active status pulse dot */}
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "flex flex-col rounded-3xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden",
            "w-[calc(100vw-2rem)] sm:w-[400px]",
            isMinimized ? "h-14" : "h-[540px] max-h-[82vh]",
          )}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-primary/10 via-background to-sky-500/10 border-b border-border/70 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex items-center justify-center size-8 rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
                <Bot className="size-4" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-card" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-foreground truncate">
                    Waypoint AI Copilot
                  </h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                    Nemotron 3.5
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  64-District Logistics Intelligence
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Expand chat" : "Minimize chat"}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              >
                {isMinimized ? (
                  <Maximize2 className="size-3.5" />
                ) : (
                  <Minimize2 className="size-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat window"
                aria-label="Close chat window"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Body Content (visible when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message Scroll Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
                {messages.map((message) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2.5",
                        isUser ? "justify-end" : "justify-start",
                      )}
                    >
                      {!isUser && (
                        <div className="size-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="size-3.5" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl p-3 shadow-xs space-y-1",
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-xs"
                            : "bg-muted/60 border border-border/60 rounded-tl-xs",
                        )}
                      >
                        {isUser ? (
                          <p className="text-xs font-medium leading-relaxed break-words">
                            {message.content}
                          </p>
                        ) : (
                          <FormattedMessage content={message.content} />
                        )}

                        <p
                          className={cn(
                            "text-[9px] text-right pt-0.5 opacity-70",
                            isUser
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {message.timestamp}
                        </p>
                      </div>

                      {isUser && (
                        <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          <User className="size-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
                    <div className="size-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="size-3.5 text-primary animate-spin" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs bg-muted/60 border border-border/60 p-3 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Analyzing logistics telemetry...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Action Chips */}
              <div className="px-3 py-2 border-t border-border/40 bg-muted/20 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
                {QUICK_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading}
                    className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-card border border-border/70 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-border/70 bg-card shrink-0 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about rates, tracking, or COD..."
                  disabled={isLoading}
                  className="flex-1 h-9 px-3 text-xs bg-muted/40 border border-border/70 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground/70"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className={cn(
                    "flex items-center justify-center size-9 rounded-xl transition-all shrink-0 cursor-pointer",
                    input.trim() && !isLoading
                      ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed",
                  )}
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WaypointAiCopilot;
