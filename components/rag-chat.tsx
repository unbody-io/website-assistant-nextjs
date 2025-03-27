"use client"

import { useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRag } from "@/hooks/use-rag"
import { useThread } from "@/hooks/use-thread"
import type { SiteMetadata } from "@/types/site.metadata"
import { ChatInput } from "./chat/chat-input"
import { ChatMessages } from "./chat/chat-messages"
import { SuggestedQuestions } from "./chat/suggested-questions"
import { shuffleArray } from "@/lib/utils"

interface RagChatProps {
  siteMetadata: SiteMetadata
}

export function RagChat({ siteMetadata }: RagChatProps) {
  const rag = useRag(siteMetadata)
  const { state, sendMessage, setInput, clearThread, isInitialState } = useThread({ rag })

  const initialSuggestedQuestions = useMemo(() => {
    const faqs = siteMetadata.xFaQ.split("\n\n");
    const qs = faqs.map((faq) => faq.split("\n")[0])
    return shuffleArray(qs.slice(0, 3))
  }, [siteMetadata.xFaQ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  return (
    <main className="min-h-screen bg-background flex flex-col w-full">
      <AnimatePresence mode="wait">
        {isInitialState ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md glass-panel subtle-shadow rounded-2xl p-4">
              <h1 className="text-center text-sm font-medium mb-6">
                How can I help you today?
              </h1>
              <div className="space-y-2 mb-4">
                <SuggestedQuestions
                  onSelect={(question) => sendMessage(question)}
                  questions={initialSuggestedQuestions}
                />
              </div>
              <ChatInput
                value={state.currentInput}
                onChange={setInput}
                onSend={() => sendMessage()}
                onKeyDown={handleKeyDown}
                isProcessing={state.isProcessing}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
            <ChatMessages
              messages={state.messages}
              ragState={rag.state}
              onFollowupSelect={sendMessage}
              suggestedQuestions={initialSuggestedQuestions}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t p-2 sm:p-4 bg-background"
            >
              <div className="max-w-2xl mx-auto px-2 sm:px-4">
                <ChatInput
                  value={state.currentInput}
                  onChange={setInput}
                  onSend={() => sendMessage()}
                  onKeyDown={handleKeyDown}
                  isProcessing={state.isProcessing}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

