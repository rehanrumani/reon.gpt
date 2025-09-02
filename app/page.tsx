"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import MessageInput from "./components/MessageInput";

type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
}

const STORAGE_KEY = "reongpt:messages:v1";
const uid = () =>
  (crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load persisted chat
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
      else
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: "Hello! I’m ReonGPT — how can I help you today?",
          },
        ]);
    } catch {}
  }, []);

  // Persist + autoscroll
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply?: string };

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data?.reply || "Hmm—no response received. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: "⚠️ Error fetching response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Regenerate last assistant reply (re-asks last user msg)
  const regenerateLast = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) await sendMessage(lastUser.content);
  };

  // Quick prompts
  const handleQuickPrompt = (prompt: string) => sendMessage(prompt);

  const clearChat = () =>
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: "Chat cleared. What would you like to do next?",
      },
    ]);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header onClear={clearChat} />
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-3xl px-4">
          <ChatContainer
            messages={messages}
            loading={loading}
            onRegenerate={regenerateLast}
          />
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-white/70 backdrop-blur dark:bg-black/50">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <MessageInput onSend={sendMessage} onQuickPrompt={handleQuickPrompt} />
        </div>
      </footer>
    </div>
  );
}
