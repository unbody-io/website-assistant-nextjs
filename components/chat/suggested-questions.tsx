"use client"

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
  questions?: string[]
}

export function SuggestedQuestions({ onSelect, questions = [] }: SuggestedQuestionsProps) {
  const defaultQuestions = ["What is Gray?", "How does Gray transform content?", "What file formats does Gray support?"]

  const displayQuestions = questions.length > 0 ? questions : defaultQuestions

  return (
    <>
      {displayQuestions.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="w-full text-left p-2 text-sm rounded-lg hover:bg-muted transition-colors"
        >
          {question}
        </button>
      ))}
    </>
  )
}

