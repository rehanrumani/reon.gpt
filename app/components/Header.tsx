"use client";
import { useState } from "react";
import { Sun, Moon, User } from "lucide-react";

export default function Header() {
  const [dark, setDark] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-3 shadow-sm sticky top-0 bg-white/60 dark:bg-black/60 backdrop-blur-lg">
      <h1 className="text-xl font-bold tracking-tight">ReonGPT</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => setDark(!dark)}>
          {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
        </button>
        <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-8 h-8 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    </header>
  );
}
