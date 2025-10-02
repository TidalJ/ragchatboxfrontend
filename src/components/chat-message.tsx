import React from "react";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex items-start gap-4 rounded-lg p-4 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      <div
        className={`rounded-lg p-3 ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
