"use client"
import { cn } from "@/lib/utils"

interface ImageSpinnerProps {
  /**
   * The image source URL to display in the background
   */
  imageSrc: string

  /**
   * The alt text for the image
   */
  imageAlt?: string

  /**
   * The size of the spinner in pixels
   * @default 100
   */
  size?: number

  /**
   * The thickness of the spinner border in pixels
   * @default 4
   */
  thickness?: number

  /**
   * The padding between the spinner and the image in pixels
   * @default 8
   */
  padding?: number

  /**
   * The color of the spinner
   * @default "#3b82f6" (blue-500)
   */
  color?: string

  /**
   * Whether the spinner should be spinning
   * @default true
   */
  isBusy?: boolean

  /**
   * Additional CSS classes to apply to the spinner
   */
  className?: string
}

export function ImageSpinner({
  imageSrc,
  imageAlt = "Loading",
  size = 100,
  thickness = 1,
  padding = 2,
  color = "#3b82f6",
  isBusy = true,
  className,
}: ImageSpinnerProps) {
  // Calculate dimensions
  const outerSize = size
  const innerSize = size - padding * 2 - thickness * 2

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: outerSize,
        height: outerSize,
      }}
    >
      {/* Spinner */}
      <div
        className={cn("absolute inset-0 rounded-full", isBusy && "animate-spin")}
        style={{
          borderWidth: thickness,
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      />

      {/* Image container */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          top: thickness + padding,
          left: thickness + padding,
          width: innerSize,
          height: innerSize,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label={imageAlt}
      />
    </div>
  )
}

