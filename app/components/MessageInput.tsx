"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Paperclip, Send, Zap } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
  onQuickPrompt?: (text: string) => void;
}

const QUICK_PROMPTS = [
  "Summarize this:",
  "Translate to English:",
  "Improve this writing:",
  "Explain like I’m 12:",
  "Review this code:",
];

export default function MessageInput({ onSend, onQuickPrompt }: Props) {
  const [value, setValue] = useState("");
  const [openQuick, setOpenQuick] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // autosize
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(160, ta.scrollHeight) + "px";
  }, [value]);

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    setOpenQuick(false);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/60">
      <div className="flex items-end gap-2">
        <button
          className="rounded-lg p-2 text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Attach file"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={taRef}
          rows={1}
          value={value}
          placeholder="Type your message…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          className="max-h-40 flex-1 resize-none bg-transparent px-1 py-2 outline-none placeholder:text-zinc-400"
        />

        <button
          onClick={() => setOpenQuick((s) => !s)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Quick prompts"
          title="Quick prompts"
        >
          <Zap className="h-5 w-5" />
        </button>

        <button
          className="rounded-lg p-2 text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Voice input (coming soon)"
          title="Voice (soon)"
        >
          <Mic className="h-5 w-5" />
        </button>

        <button
          onClick={send}
          className="rounded-xl bg-black px-3 py-2 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          aria-label="Send"
          title="Send (Enter)"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {openQuick && (
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => onQuickPrompt?.(q)}
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-zinc-600 hover:bg-black/5 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
