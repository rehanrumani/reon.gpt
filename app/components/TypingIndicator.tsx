"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-black/10 bg-white/70 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-zinc-500"
          animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
