import { SuggestedQuestions } from "@/components/chat/suggested-questions"

interface NotRelevantMessageProps {
  onFollowupSelect: (question: string) => void
  questions: string[]
}

export function NotRelevantMessage({ onFollowupSelect, questions }: NotRelevantMessageProps) {
  return (
    <div className="glass-panel subtle-shadow rounded-2xl p-4 text-center">
      <p className="text-muted-foreground mb-4">
        Sorry, this query is not relevant to our website context.
      </p>
      <SuggestedQuestions
        onSelect={onFollowupSelect}
        questions={questions}
      />
    </div>
  )
} 