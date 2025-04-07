import { SourceChat } from "@/components/source-chat"

interface PageProps {
  params: {
    source_name: string
  }
}

export default async function SourcePage({ params }: PageProps) {
  const { source_name } = await params;
  return <SourceChat sourceName={source_name} />
} 