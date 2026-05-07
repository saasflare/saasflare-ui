// @draft
/**
 * @fileoverview Image that swaps to an alternate source on hover.
 * @author Saasflare™
 * Crossfades between a primary and alternate image on mouse hover.
 * @module packages/ui/components/ui/image-swap-hover
 * @package ui
 *
 * @component
 * @example
 * import { ImageSwapHover } from '@saasflare/ui';
 * <ImageSwapHover
 *   src="/product-front.jpg"
 *   hoverSrc="/product-back.jpg"
 *   alt="Product view"
 * />
 */

import { cn } from "../../lib"

/** Props for the ImageSwapHover component. */
export interface ImageSwapHoverProps {
  /** Default image source. */
  src: string
  /** Image source to show on hover. */
  hoverSrc: string
  /** Alt text for both images. */
  alt: string
  /** CSS aspect-ratio. Default: `"1/1"` */
  aspectRatio?: string
  /** Additional class names. */
  className?: string
}

/**
 * Image that crossfades to an alternate source on hover.
 *
 * @component
 * @package ui
 */
export function ImageSwapHover({
  src,
  hoverSrc,
  alt,
  aspectRatio = "1/1",
  className,
}: ImageSwapHoverProps) {
  return (
    <div
      className={cn("group relative overflow-hidden rounded-xl", className)}
      style={{ aspectRatio }}
      data-slot="image-swap-hover"
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-0"
      />
      <img
        src={hoverSrc}
        alt={alt}
        className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  )
}
