"use client"

import { ImageSpinner } from "../image-spinner"

interface GrayLogoProps {
  size?: number
  className?: string
  isBusy?: boolean
}

export function AppLogo({ size = 32, className = "", isBusy = false }: GrayLogoProps) {
  return (
    <ImageSpinner size={size} 
                  className={className} 
                  imageSrc="/logo.png" 
                  isBusy={isBusy}
                  thickness={2}
    />
  )
}

