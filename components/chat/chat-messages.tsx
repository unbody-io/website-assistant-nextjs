import { useRef, useEffect } from "react"
import type { Message } from "@/types/message"
import type { RagState } from "@/hooks/use-rag"
import { ChatMessage } from "./chat-message"
import { CurrentResponse } from "./current-response"
import { NotRelevantMessage } from "./not-relevant-message"

interface ChatMessagesProps {
  messages: Message[]
  ragState: RagState
  onFollowupSelect: (question: string) => void
  suggestedQuestions: string[]
}

export function ChatMessages({ messages, ragState, onFollowupSelect, suggestedQuestions }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, ragState])

  return (
    <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Past Messages */}
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            onFollowupSelect={onFollowupSelect}
            isPast={true && index < messages.length - 1}
          />
        ))}

        {/* Current Assistant Response */}
        <CurrentResponse
          ragState={ragState}
          onFollowupSelect={onFollowupSelect}
        />

        {/* Not Relevant Message */}
        {ragState.status?.understanding && ragState.parsedQuery?.isNotRelevant && (
          <NotRelevantMessage
            onFollowupSelect={onFollowupSelect}
            questions={suggestedQuestions}
          />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 