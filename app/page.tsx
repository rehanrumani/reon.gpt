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

  // load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
      else
        setMessages([
          { id: uid(), role: "assistant", content: "Hello! I’m ReonGPT — how can I help?" },
        ]);
    } catch {}
  }, []);

  // persist + autoscroll
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content) return;

    setMessages((prev) => [...prev, { id: uid(), role: "user", content }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data?.reply || data?.error || "No response. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: "⚠️ Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const regenerateLast = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) await sendMessage(lastUser.content);
  };

  const clearChat = () =>
    setMessages([{ id: uid(), role: "assistant", content: "Chat cleared. What next?" }]);

  const quickPrompt = (p: string) => sendMessage(p);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-white to-gray-100 dark:from-zinc-950 dark:to-black">
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
          <MessageInput onSend={sendMessage} onQuickPrompt={quickPrompt} />
        </div>
      </footer>
    </div>
  );
}
