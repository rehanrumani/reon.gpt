"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setChat([...newChat, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChat([...newChat, { role: "assistant", content: "❌ Error calling API" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">💬 Reon GPT</h1>
        <div className="space-y-3 h-96 overflow-y-auto border p-3 rounded">
          {chat.map((c, i) => (
            <div
              key={i}
              className={`p-2 rounded-md ${
                c.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              <b>{c.role === "user" ? "You" : "Reon GPT"}:</b> {c.content}
            </div>
          ))}
          {loading && <div className="text-gray-500">Thinking...</div>}
        </div>

        <div className="flex mt-4 gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
