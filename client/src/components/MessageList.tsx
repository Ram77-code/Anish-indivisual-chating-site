import { useEffect, useRef } from "react";
import { type Message } from "@shared/schema";
import { CharacterAvatar } from "./CharacterAvatar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  characterName: string;
  characterAvatar?: string | null;
  isTyping?: boolean;
}

export function MessageList({ messages, characterName, characterAvatar, isTyping }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-3xl">👋</span>
        </div>
        <p className="text-lg font-medium text-foreground">No messages yet</p>
        <p className="text-sm">Start the conversation with {characterName}!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      <AnimatePresence initial={false}>
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const showAvatar = !isUser && (index === 0 || messages[index - 1].role === "user");
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex w-full",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn("flex max-w-[80%] md:max-w-[70%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
                {!isUser && (
                  <div className="flex-shrink-0 w-8">
                    {showAvatar ? (
                      <CharacterAvatar 
                        name={characterName} 
                        src={characterAvatar} 
                        size="sm" 
                      />
                    ) : <div className="w-8" />}
                  </div>
                )}
                
                <div className={cn(
                  "flex flex-col", 
                  isUser ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-4 py-3 text-sm md:text-base leading-relaxed break-words",
                    isUser 
                      ? "message-bubble-user" 
                      : "message-bubble-assistant"
                  )}>
                    {msg.content}
                  </div>
                  {msg.timestamp && (
                    <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-70">
                      {format(new Date(msg.timestamp), "h:mm a")}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start w-full"
        >
          <div className="flex max-w-[80%] gap-3">
            <div className="flex-shrink-0 w-8">
              <CharacterAvatar 
                name={characterName} 
                src={characterAvatar} 
                size="sm" 
              />
            </div>
            <div className="message-bubble-assistant px-4 py-4 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
