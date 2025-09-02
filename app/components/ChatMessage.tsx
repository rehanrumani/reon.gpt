"use client";

import { useState } from "react";
import { Clipboard, Check, RefreshCw } from "lucide-react";

export default function ChatMessage({
  role,
  content,
  onRegenerate,
}: {
  role: "user" | "assistant";
  content: string;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const isUser = role === "user";

  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm backdrop-blur
      ${isUser
        ? "border-black/10 bg-white/90 dark:border-white/10 dark:bg-zinc-900/70"
        : "border-black/10 bg-zinc-50/90 dark:border-white/10 dark:bg-zinc-900/50"}`}
    >
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100">
        {content}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Copy message"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>

        {!isUser && onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Regenerate response"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
}
