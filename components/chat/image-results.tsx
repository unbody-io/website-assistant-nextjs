"use client"

import { motion } from "framer-motion"
import type { IImageBlock } from "unbody"
import Imgix from "react-imgix";
interface ImageResultsProps {
  results: IImageBlock[]
  isLoading?: boolean
}

export function ImageResults({ results, isLoading = false }: ImageResultsProps) {
  if (results.length === 0 && !isLoading) return null

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Images</h3>
      <div className="grid grid-cols-3 gap-2">
        {isLoading
          ? // Skeleton loading state
            Array(3)
              .fill(0)
              .map((_, i) => <div key={i} className="aspect-video bg-muted rounded animate-pulse" />)
          : results.map((image, index) => (
              <a
                key={index}
                href={image.url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-video rounded overflow-hidden border border-border/50 hover:opacity-90 transition-opacity"
              >
                <img src={image.url || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
              </a>
            ))}
      </div>
    </motion.div>
  )
}

