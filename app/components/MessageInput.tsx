"use client";
import { useState } from "react";
import { Send, Paperclip, Mic, Zap } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 flex items-center gap-3 border-t bg-white dark:bg-black">
      <button className="text-gray-500 hover:text-black">
        <Paperclip size={18} />
      </button>
      <textarea
        className="flex-1 resize-none p-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button className="text-gray-500 hover:text-black">
        <Mic size={18} />
      </button>
      <button className="text-gray-500 hover:text-black">
        <Zap size={18} />
      </button>
      <button
        onClick={handleSend}
        className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-700"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
