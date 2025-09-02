import { motion } from "framer-motion";
import { Copy } from "lucide-react";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm ${
        role === "user"
          ? "self-end bg-gray-200 dark:bg-gray-700"
          : "self-start bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex justify-between gap-2">
        <p className="text-sm">{content}</p>
        {role === "assistant" && (
          <button
            className="text-xs text-gray-400 hover:text-gray-600"
            onClick={() => navigator.clipboard.writeText(content)}
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
