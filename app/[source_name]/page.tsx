import { SourceChat } from "@/components/source-chat"
import { WebsiteDataProvider } from "@/app/context/WebsiteDataContext"

interface PageProps {
  params: {
    source_name: string
  }
}

export default function SourcePage({ params }: PageProps) {
  return (
    <WebsiteDataProvider sourceName={params.source_name}>
      <SourceChat sourceName={params.source_name} />
    </WebsiteDataProvider>
  )
} 