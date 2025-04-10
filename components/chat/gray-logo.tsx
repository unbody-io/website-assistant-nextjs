"use client"

import { ImageSpinner } from "../image-spinner"
import { ExtendedImageBlock } from "@/types/data.types"
interface GrayLogoProps {
  size?: number
  className?: string
  isBusy?: boolean
  logo?: ExtendedImageBlock
}

export function AppLogo({ size = 32, className = "", isBusy = false, logo }: GrayLogoProps) {
  return (
    <ImageSpinner size={size} 
                  className={className} 
                  imageSrc={logo?.url as string || "/logo.png"} 
                  isBusy={isBusy}
                  thickness={2}
    />
  )
}

