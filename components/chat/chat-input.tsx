import { SendIcon } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isProcessing: boolean
}

export function ChatInput({ value, onChange, onSend, onKeyDown, isProcessing }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask me anything..."
        disabled={isProcessing}
        className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2 
          focus:ring-0 focus:border-foreground/20 transition-colors text-sm disabled:opacity-50"
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || isProcessing}
        className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
      >
        <SendIcon size={16} />
      </button>
    </div>
  )
} 