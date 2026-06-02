"use client"

/**
 * @fileoverview Click-to-play video modal with poster thumbnail.
 * @author Saasflare™
 * Renders a poster image with a play button overlay. On click, opens a
 * dialog with the video playing. Supports YouTube, Vimeo, and direct URLs.
 * @module packages/ui/components/ui/hero-video-dialog
 * @package ui
 *
 * @component
 * @example
 * import { HeroVideoDialog } from '@saasflare/ui';
 * <HeroVideoDialog
 *   videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
 *   thumbnailSrc="/product-demo-poster.jpg"
 *   thumbnailAlt="Product demo video"
 * />
 *
 * @example
 * // With custom aspect ratio
 * <HeroVideoDialog
 *   videoSrc="https://player.vimeo.com/video/123456789"
 *   thumbnailSrc="/poster.jpg"
 *   thumbnailAlt="Demo"
 *   aspectRatio="4/3"
 * />
 */

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, m } from "motion/react"
import { PlayIcon, XIcon } from "./phosphor"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"
import { useFocusTrap } from "../../hooks/use-focus-trap"
import { useScrollLock } from "../../hooks/use-scroll-lock"

/** Props for the HeroVideoDialog component. */
export interface HeroVideoDialogProps
  extends Omit<React.ComponentProps<"button">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Video embed URL (YouTube/Vimeo embed or direct video URL). */
  videoSrc: string
  /** Poster thumbnail image URL. */
  thumbnailSrc: string
  /** Alt text for the thumbnail image. */
  thumbnailAlt: string
  /** CSS aspect-ratio for the thumbnail. Default: `"16/9"` */
  aspectRatio?: string
}

/**
 * Hero video section with click-to-play dialog.
 *
 * - Shows a thumbnail with a centered play button
 * - Opens a modal dialog with the embedded video on click
 * - Animated with spring physics (scale + fade), gated on the `animated` axis
 * - Accessible: focus trap + restoration, body-scroll lock, keyboard close, aria labels
 *
 * @component
 * @package ui
 */
export function HeroVideoDialog({
  videoSrc,
  thumbnailSrc,
  thumbnailAlt,
  aspectRatio = "16/9",
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: HeroVideoDialogProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springBouncy)
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  const overlayRef = useFocusTrap<HTMLDivElement>(open)
  useScrollLock(open)

  // Document-level Escape so close works regardless of which element holds focus.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, close])

  return (
    <>
      {/* Thumbnail with play button */}
      <button
        {...props}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative w-full cursor-pointer overflow-hidden rounded-xl border shadow-lg",
          className,
        )}
        style={{ aspectRatio }}
        aria-label={`Play video: ${thumbnailAlt}`}
        data-slot="hero-video-dialog"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
          <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110">
            <PlayIcon weight={sf.iconWeight} className="ml-1 size-7 text-foreground" />
          </div>
        </div>
      </button>

      {/* Video dialog */}
      <AnimatePresence>
        {open && (
          <m.div
            ref={overlayRef}
            initial={motion.disabled ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motion.transition}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            tabIndex={-1}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close video"
            >
              <XIcon weight={sf.iconWeight} className="size-6" />
            </button>

            {/* Video container */}
            <m.div
              initial={motion.disabled ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={motion.disabled ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
              transition={motion.transition}
              className="w-full max-w-5xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio }}>
                <iframe
                  src={videoSrc}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={thumbnailAlt}
                />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
