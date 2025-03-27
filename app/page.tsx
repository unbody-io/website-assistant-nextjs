"use client"

import { AppLogo } from "@/components/chat/gray-logo"
import { RagChat } from "@/components/rag-chat"
import { Progress } from "@/components/ui/progress"
import { SiteMetadata } from "@/types/site.metadata"
import { useEffect } from "react"
import { useState } from "react"

export default function ChatPage() {

  const [siteMetadata, setSiteMetadata] = useState<SiteMetadata | null>(null)
  const [siteMetadataLoaded, setSiteMetadataLoaded] = useState<boolean>(false)
  const [siteMetadataError, setSiteMetadataError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/get-site-metadata",{method: "POST"})
      .then((res) => res.json())
      .then((data) => {
        setSiteMetadata(data)
        setSiteMetadataLoaded(true)
      })
  }, [])

  return (
    <div className="flex h-screen w-full justify-center items-center">
      {
        siteMetadataError ? (
          <div>Error loading site metadata</div>
        ) : (
          siteMetadataLoaded ? (
            <RagChat siteMetadata={siteMetadata as SiteMetadata} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                <AppLogo isBusy={true} size={32}/>
                <span>Loading...</span>
              </div>
            </div>
          )
        )
      } 
    </div>
  )
}

