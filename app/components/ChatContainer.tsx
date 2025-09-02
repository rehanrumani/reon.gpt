"use client";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatContainer({ messages, loading }: any) {
  return (
    <div className="flex flex-col flex-1 gap-3 p-4 overflow-y-auto">
      {messages.map((msg: any, i: number) => (
        <ChatMessage key={i} role={msg.role} content={msg.content} />
      ))}
      {loading && <TypingIndicator />}
    </div>
  );
}
