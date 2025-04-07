"use client"

import { useState, useEffect } from "react"
import { AppLogo } from "@/components/chat/gray-logo"
import { RagChat } from "@/components/rag-chat"
import { SiteMetadata } from "@/types/site.metadata"
import { Source } from "unbody/admin"

interface SourceChatProps {
  sourceName: string
}

export function SourceChat({ sourceName }: SourceChatProps) {
  const [siteMetadata, setSiteMetadata] = useState<{siteMetadata: SiteMetadata, source: Source} | null>(null)
  const [siteMetadataLoaded, setSiteMetadataLoaded] = useState<boolean>(false)
  const [siteMetadataError, setSiteMetadataError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/api/get-site-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ source_name: sourceName })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to fetch site metadata")
        }
        const data = await response.json()
        setSiteMetadata(data)
        setSiteMetadataLoaded(true)
      } catch (error) {
        console.error("Error fetching site metadata:", error)
        setSiteMetadataError(error instanceof Error ? error.message : "Failed to fetch site metadata")
      }
    }

    fetchMetadata()
  }, [sourceName])

  if (siteMetadataError) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-destructive">Error loading site metadata: {siteMetadataError}</div>
      </div>
    )
  }

  if (!siteMetadataLoaded || !siteMetadata) {
    return (
      <div className="flex h-screen w-full justify-center items-center">
        <div className="text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
          <AppLogo isBusy={true} size={32}/>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // At this point, siteMetadata is guaranteed to be non-null
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <RagChat siteMetadata={siteMetadata.siteMetadata} source={siteMetadata.source} />
    </div>
  )
} 