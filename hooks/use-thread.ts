"use client"

import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { RagState } from "@/hooks/use-rag"
import { AssistantMessage, Message, UserMessage } from "@/types/message"

export interface ThreadState {
  messages: Message[]
  isProcessing: boolean
  currentInput: string
}

interface UseThreadProps {
  rag: {
    state: RagState
    processQuery: (query: string) => Promise<void>
    reset: () => void
  }
}

export function useThread({ rag }: UseThreadProps) {
  const [state, setState] = useState<ThreadState>({
    messages: [],
    isProcessing: false,
    currentInput: "",
  })

  // Add assistant message when RAG processing completes
  useEffect(() => {
    if (!rag.state.isProcessing && rag.state.answer && rag.state.parsedQuery) {
      const assistantMessage: AssistantMessage = {
        id: uuidv4(),
        role: "assistant",
        timestamp: Date.now(),
        content: rag.state
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        messages: [...prev.messages, assistantMessage]
      }))
    }
  }, [rag.state])

  const setInput = useCallback((input: string) => {
    setState((prev) => ({
      ...prev,
      currentInput: input,
    }))
  }, [])

  const sendMessage = useCallback(
    async (content?: string) => {
      const messageContent = content || state.currentInput
      if (!messageContent.trim() || state.isProcessing) return

      // Set processing state immediately
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        currentInput: "",
        messages: [
          ...prev.messages,
          {
            id: uuidv4(),
            role: "user",
            timestamp: Date.now(),
            content: messageContent
          } as UserMessage
        ],
      }))

      // Start RAG processing
      rag.processQuery(messageContent)
    },
    [rag, state.currentInput, state.isProcessing],
  )

  const clearThread = useCallback(() => {
    setState({
      messages: [],
      isProcessing: false,
      currentInput: "",
    })
    rag.reset()
  }, [rag])

  const addMessage = useCallback(
    (message: Message) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        isProcessing: message.role === "user"
      }))
      if (message.role === "user") {
        // Start processing immediately with a fixed timestamp
        const timestamp = Date.now();
        setState((prev) => ({
          ...prev,
          currentInput: "",
          messages: [
            ...prev.messages,
            {
              id: "current",
              role: "assistant",
              timestamp,
              content: {
                answer: null,
                followups: [],
                sources: {
                  web: [],
                  images: []
                },
                parsedQuery: message.content,
                status: {
                  understanding: { isBusy: true, error: null },
                  searching: { isBusy: false, error: null },
                  thinking: { isBusy: false, error: null },
                },
                isProcessing: true,
                error: null,
                timestamp
              },
            } as AssistantMessage
          ]
        }))
      }
    },
    []
  )

  return {
    state,
    sendMessage,
    setInput,
    clearThread,
    isInitialState: state.messages.length === 0,
    addMessage,
  }
}

