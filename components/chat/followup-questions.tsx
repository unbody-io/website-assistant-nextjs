"use client"

import { motion } from "framer-motion"
import { StatusState } from "@/hooks/use-rag"

interface FollowupQuestionsProps {
  questions: string[]
  onSelect: (question: string) => void
  status: StatusState
}

export function FollowupQuestions({ questions, onSelect, status }: FollowupQuestionsProps) {

  if(status.isBusy) {
    return <Skeleton />
  }

  if(status.error) {
    return <div className="text-red-500">{status.error}</div>
  }

  if(questions.length === 0) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Follow-up questions</h3>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
                key={index}
                onClick={() => onSelect(question)}
                className="px-3 py-1.5 text-xs rounded-full border border-border/50 hover:bg-muted/50 transition-colors"
              >
                {question}
              </button>
              ))}
      </div>
    </motion.div>
  )
}


const Skeleton = () => {
  return (
    Array(3)
      .fill(0)
      .map((_, i) => <div key={i} className="h-8 w-32 bg-muted rounded-full animate-pulse" />)
  )
} 

