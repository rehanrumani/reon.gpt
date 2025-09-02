"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, User, Trash2 } from "lucide-react";

export default function Header({ onClear }: { onClear?: () => void }) {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="text-xl font-semibold tracking-tight">
          <span className="rounded-xl bg-black/90 px-2 py-1 text-white dark:bg-white dark:text-black">
            Reon
          </span>
          <span className="ml-1 text-black/80 dark:text-white/80">GPT</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full border border-black/10 p-2 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/90 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-white/90"
              aria-label="Profile menu"
            >
              <User className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-xl border border-black/10 bg-white p-2 text-sm shadow-xl dark:border-white/10 dark:bg-zinc-900"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    onClear?.();
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Clear chat
                </button>
                <div className="mt-1 rounded-lg px-3 py-2 text-zinc-500">Settings (soon)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
