"use client"
import { RagChat } from "@/components/rag-chat"
import { useWebsiteData } from "@/app/context/WebsiteDataContext"

interface SourceChatProps {
  sourceName: string
}

export function SourceChat({ sourceName }: SourceChatProps) {
  const appData = useWebsiteData();

  if (appData.error) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-destructive">Error loading site metadata: {appData.error}</div>
      </div>
    )
  }


  if (appData.loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
          <span>Loading data for {sourceName}...</span>
        </div>
      </div>
    )
  }


  if (!appData.siteMetadata || !appData.source) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-destructive">Sorry, we couldn't find any information on this website.</div>
      </div>
    )
  }

  // At this point, siteMetadata is guaranteed to be non-null
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <RagChat/>
    </div>
  )
} 