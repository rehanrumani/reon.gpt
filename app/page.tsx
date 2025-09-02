"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import MessageInput from "@/components/MessageInput";

type Role = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: Role;
  content: string;
}

const STORAGE_KEY = "reongpt:messages:v1";

function uid() {
  // crypto.randomUUID() is widely supported; fallback just in case.
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /** Load previous conversation (if any) */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Optional friendly greeting on first load
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: "Hello! How can I assist you today?",
          },
        ]);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  /** Persist to localStorage + scroll to bottom on every change */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Send a message -> hit /api/chat -> append reply */
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = { id: uid(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string };
      const reply =
        typeof data?.reply === "string" && data.reply.length > 0
          ? data.reply
          : "Hmm, I couldn't generate a response. Please try again.";

      const assistantMessage: Message = {
        id: uid(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: uid(),
        role: "assistant",
        content: "⚠️ Error fetching response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /** Optional helpers: you can hook these into buttons later if you like */
  const clearConversation = () => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: "Chat cleared. How can I help you next?",
      },
    ]);
  };

  const regenerateLastAnswer = async () => {
    // Find the last user message and ask again
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      await sendMessage(lastUser.content);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-black">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto h-full max-w-3xl px-4">
          <ChatContainer messages={messages} loading={loading} />
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-white/70 backdrop-blur dark:bg-black/50">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <MessageInput onSend={sendMessage} />
          {/* If you later expose extra actions in MessageInput, you can pass:
              onClear={clearConversation} onRegenerate={regenerateLastAnswer} */}
        </div>
      </footer>
    </div>
  );
}
