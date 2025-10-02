"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { generateResponse } from "@/lib/api";
import { useAppStore } from "@/store";

export default function Chat() {
  const { messages, addMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { role: "user" as const, content: input };
      addMessage(userMessage);
      setInput("");
      setIsLoading(true);

      try {
        const responseContent = await generateResponse(input);
        const assistantMessage = {
          role: "assistant" as const,
          content: responseContent,
        };
        addMessage(assistantMessage);
      } catch (error) {
        const err = error as Error;
        const errorMessage = {
          role: "assistant" as const,
          content: `Error: ${err.message || 'An unknown error occurred.'}`,
        };
        addMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 border-t p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
