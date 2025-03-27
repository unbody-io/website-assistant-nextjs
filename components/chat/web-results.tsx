"use client"

import { motion } from "framer-motion"
import { ExternalLink, SquareMousePointer, ChevronLeft, ChevronRight } from "lucide-react"
import { ExtendedWebPage } from "@/types/data.types"
import { formatUrl } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useRef } from "react"
import { StatusState } from "@/hooks/use-rag"
interface WebPageDialogProps {
  webpage: ExtendedWebPage
  open: boolean
  onOpenChange: (open: boolean) => void
}

function WebPageDialog({ webpage, open, onOpenChange }: WebPageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{webpage.title as string}</DialogTitle>
        </DialogHeader>
        {/* Dialog content will go here */}
      </DialogContent>
    </Dialog>
  )
}

interface WebPageThumbnailProps {
  result: ExtendedWebPage
  className?: string
  onClick?: () => void
}

function WebPageThumbnail({ result, className = "", onClick }: WebPageThumbnailProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClick = () => {
    setDialogOpen(true)
    onClick?.()
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex-shrink-0 w-64 p-2 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 bg-muted/30 rounded flex items-center justify-center overflow-hidden">
            {result.blocks?.ImageBlock?.[0]?.url ? (
              <img 
                src={result.blocks.ImageBlock[0].url as string} 
                alt={result.title as string} 
                className="w-full h-full object-cover"
              />
            ) : (
              <SquareMousePointer className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <h4 className="text-sm font-medium truncate">{result.title as string}</h4>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{result.description as string}</p>
        <a
          href={result.url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500/80 block truncate mt-1 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {formatUrl(result.url as string)}
        </a>
      </div>
      <WebPageDialog webpage={result} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

function WebPageThumbnailMin({ result, className = "", onClick }: WebPageThumbnailProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClick = () => {
    setDialogOpen(true)
    onClick?.()
  }
  
  return (
    <>
      <div
        onClick={handleClick}
        className={`flex-shrink-0 w-48 p-2 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted/30 rounded flex items-center justify-center overflow-hidden">
            {result.blocks?.ImageBlock?.[0]?.url ? (
              <img 
                src={result.blocks.ImageBlock[0].url as string} 
                alt={result.title as string} 
                className="w-full h-full object-cover"
              />
            ) : (
              <SquareMousePointer className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <a
            href={result.url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500/80 truncate hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {formatUrl(result.url as string)}
          </a>
        </div>
      </div>
      <WebPageDialog webpage={result} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

interface WebResultsProps {
  results: ExtendedWebPage[]
  isMinimum?: boolean
  status: StatusState
  onThumbnailClick?: (result: ExtendedWebPage) => void
}

export function WebResults({ results, status, isMinimum = false, onThumbnailClick }: WebResultsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  if (results.length === 0 && !status.isBusy) return null

  if(status.error) {
    return <div className="text-red-500">{status.error}</div>
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setShowLeftArrow(container.scrollLeft > 0)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = direction === 'left' ? -300 : 300
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 relative">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Sources</h3>
      <div className="relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-sm hover:bg-background/90 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {status.isBusy
            ? // Skeleton loading state
              <Skeleton />
            : results.map((result, index) => (
                result.url ? (
                  isMinimum ? (
                    <WebPageThumbnailMin 
                      key={index} 
                      result={result} 
                      onClick={() => onThumbnailClick?.(result)}
                    />
                  ) : (
                    <WebPageThumbnail 
                      key={index} 
                      result={result} 
                      onClick={() => onThumbnailClick?.(result)}
                    />
                  )
                ) : null
              ))}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-sm hover:bg-background/90 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}


const Skeleton = () => {
  return (
    Array(3)
    .fill(0)
    .map((_, i) => (
      <div key={i} className={`flex-shrink-0 p-2 rounded-lg border border-border/50`}>
        <div className="w-full h-8 bg-muted rounded animate-pulse mb-2" />
        <div className="h-3 bg-muted rounded animate-pulse" />
      </div>
    ))
  )
}