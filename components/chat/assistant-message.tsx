"use client"

import { motion } from "framer-motion"
import { WebResults } from "./web-results"
import { FollowupQuestions } from "./followup-questions"
import { AppLogo } from "./gray-logo"
import { GenerativeAnswer } from "./gen-response"
import { MiniStatusIndicator } from "./status-indicator"
import type { AssistantMessage as AssistantMessageType } from "@/types/message"
import { useMemo } from "react"
interface AssistantMessageProps {
  data: AssistantMessageType
  isPast: boolean
  onFollowupSelect?: (question: string) => void
}

export function AssistantMessage({
  data,
  isPast,
  onFollowupSelect,
}: AssistantMessageProps) {
  return (
    <div className="w-full">
      <div className="flex gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0">
          <AppLogo size={26}
            isBusy={
              data.content.isProcessing || 
              data.content.status.thinking.isBusy ||
              data.content.status.searching.isBusy ||
              data.content.status.understanding.isBusy
            } 
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-2 h-6 flex items-center">
            <MiniStatusIndicator 
              status={data.content.status} 
              isProcessing={data.content.isProcessing}
              startedAt={data.timestamp}
            />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-4"
          >
            <GenerativeAnswer 
              status={data.content.status.thinking}
              answer={data.content.answer} 
            />
          </motion.div>

          <WebResults 
            results={data.content.sources.web} 
            status={data.content.status.searching}
            isMinimum={isPast}
          />

          {onFollowupSelect && data.content.followups.length > 0 && (
            <FollowupQuestions
              questions={data.content.followups}
              onSelect={onFollowupSelect}
              status={data.content.status.thinking}
            />
          )}
        </div>
      </div>
    </div>
  )
} 