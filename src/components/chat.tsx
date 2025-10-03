"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import { generateResponse } from "@/lib/api";
import { useAppStore } from "@/store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function Chat() {
  const { messages, addMessage } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useRag, setUseRag] = useState(true);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { role: "user" as const, content: input };
      addMessage(userMessage);
      setInput("");
      setIsLoading(true);

      try {
        const responseContent = await generateResponse(input, useRag);
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
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="rag-toggle"
              checked={useRag}
              onCheckedChange={setUseRag}
            />
            <Label htmlFor="rag-toggle" className="text-sm font-medium">
              Document
              <Tooltip>
                <TooltipTrigger>
                  <Info className="inline h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Answers will include information from your uploaded documents</p>
                </TooltipContent>
              </Tooltip>
            </Label>
          </div>
        </div>
        <Button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
