"use client"

import { motion } from "framer-motion"
import type { Message } from "@/types/message"
import { isUserMessage } from "@/types/message"
import { AssistantMessage } from "@/components/chat/assistant-message"
interface ChatMessageProps {
  message: Message
  onFollowupSelect: (question: string) => void
  isPast: boolean
}

export function ChatMessage({ message, onFollowupSelect, isPast }: ChatMessageProps) {
  return (
    <div className="space-y-4">
      {isUserMessage(message) ? (
        <div className="chat-message w-full flex justify-end">
          <p className="text-primary-foreground bg-primary p-2 rounded-md text-sm">{message.content}</p>
        </div>
      ) : (
        <AssistantMessage
          data={message}
          onFollowupSelect={onFollowupSelect}
          isPast={isPast}
        />
      )}
    </div>
  )
}

