"use client"

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
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the ImageSwapHover component. */
export interface ImageSwapHoverProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
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
  surface,
  radius,
  animated,
  iconWeight,
  style,
  ...props
}: ImageSwapHoverProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      className={cn("group relative overflow-hidden rounded-xl", className)}
      style={{ aspectRatio, ...style }}
      {...props}
      data-slot="image-swap-hover"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
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
