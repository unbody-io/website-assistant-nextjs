import ReactMarkdown from "react-markdown"
import { StatusState } from "@/hooks/use-rag"

interface GenerativeAnswerProps {
    answer: string | null
    status: StatusState
}
  
  
  export const GenerativeAnswer = ({ status, answer = null }: GenerativeAnswerProps) => {
    if (status.isBusy) {
      return <Sekelton />
    }
    if (status.error) {
      return <div className="text-red-500">{status.error}</div>
    }
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    )
  }
  
const Sekelton = () => {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-full" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
    </div>
    )
  }
  