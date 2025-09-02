"use client";

import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
}

interface Props {
  messages: Message[];
  loading: boolean;
  onRegenerate?: () => void;
}

export default function ChatContainer({ messages, loading, onRegenerate }: Props) {
  return (
    <section className="flex h-full flex-col gap-3 overflow-y-auto py-4">
      {messages.length === 0 ? (
        <div className="mt-32 text-center text-sm text-zinc-500">
          Start a conversation with ReonGPT
        </div>
      ) : (
        messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <ChatMessage
              role={m.role}
              content={m.content}
              onRegenerate={m.role === "assistant" ? onRegenerate : undefined}
            />
          </motion.div>
        ))
      )}

      {loading && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}
    </section>
  );
}
