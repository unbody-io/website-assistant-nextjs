"use client"

import { useState, useCallback } from "react"
import type { SiteMetadata } from "@/types/site.metadata"
import type { ParsedQuery } from "@/lib/unbody/unbody.utils"
import type { ExtendedWebPage } from "@/types/data.types"
import type { IImageBlock } from "unbody"

export interface StatusState {
  isBusy: boolean
  error: string | null
}

// This is our source of truth - the RAG state
export interface RagState {
  answer: string | null
  followups: string[]
  sources: {
    web: ExtendedWebPage[]
    images: IImageBlock[]
  }
  parsedQuery: ParsedQuery<any> | null
  status: {
    understanding: StatusState
    searching: StatusState
    thinking: StatusState
  }
  isProcessing: boolean
  error: string | null
  timestamp: number
}

// Initial state for the RAG process
const initialState: RagState = {
  answer: null,
  followups: [],
  sources: {
    web: [],
    images: []
  },
  parsedQuery: null,
  status: {
    understanding: { isBusy: false, error: null },
    searching: { isBusy: false, error: null },
    thinking: { isBusy: false, error: null }
  },
  isProcessing: false,
  error: null,
  timestamp: Date.now()
}

export function useRag(siteMetadata: SiteMetadata) {
  const [state, setState] = useState<RagState>(initialState)

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const processQuery = useCallback(
    async (query: string) => {
      reset()
      setState((prev) => ({
        ...prev,
        isProcessing: true,
        status: {
          ...prev.status,
          understanding: { isBusy: true, error: null }
        }
      }))

      try {
        const response = await fetch("/api/rag-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, siteMetadata }),
        })

        if (!response.ok || !response.body) {
          throw new Error("Failed to start processing")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read()

              if (done) break

              buffer += decoder.decode(value, { stream: true })
              const events = buffer.split("\n\n")
              buffer = events.pop() || ""

              for (const event of events) {
                const lines = event.split("\n")
                const eventType = lines[0].replace("event: ", "")
                const data = JSON.parse(lines[1].replace("data: ", ""))

                switch (eventType) {
                  case "query-parser":
                    setState((prev) => ({
                      ...prev,
                      parsedQuery: data,
                    }))
                    break

                  case "status":
                    setState((prev) => ({
                      ...prev,
                      status: {
                        ...prev.status,
                        [data.key]: {
                          isBusy: data.isBusy,
                          error: data.error || null
                        }
                      },
                    }))
                    break

                  case "results":
                    setState((prev) => ({
                      ...prev,
                      sources: {
                        web: data.webpages,
                        images: data.images
                      }
                    }))
                    break

                  case "response":
                    setState((prev) => ({
                      ...prev,
                      answer: data.answer,
                      followups: data.followups,
                    }))
                    break

                  case "followups":
                    setState((prev) => ({
                      ...prev,
                      followups: data.questions,
                    }))
                    break

                  case "processing":
                    if (data.stage === "complete") {
                      setState((prev) => ({
                        ...prev,
                        isProcessing: false,
                      }))
                    }
                    break

                  case "error":
                    setState((prev) => ({
                      ...prev,
                      error: data.message,
                      isProcessing: false,
                    }))
                    break
                }
              }
            }
          } catch (error) {
            console.error("Error processing stream:", error)
            setState((prev) => ({
              ...prev,
              error: error instanceof Error ? error.message : "Unknown error",
              isProcessing: false,
            }))
          }
        }

        processStream()
      } catch (error) {
        console.error("Error starting RAG process:", error)
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
          isProcessing: false,
        }))
      }
    },
    [siteMetadata],
  )

  return {
    state,
    processQuery,
    reset,
  }
}

