import type { RagState } from "@/hooks/use-rag"
import { AssistantMessage } from "@/components/chat/assistant-message"

interface CurrentResponseProps {
  ragState: RagState
  onFollowupSelect: (question: string) => void
}

export function CurrentResponse({ ragState, onFollowupSelect }: CurrentResponseProps) {
  if (!ragState.isProcessing) return null

  return (
    <AssistantMessage
      data={{
        id: "current",
        role: "assistant",
        timestamp: ragState.timestamp,
        content: ragState
      }}
      onFollowupSelect={onFollowupSelect}
      isPast={false}
    />
  )
} 