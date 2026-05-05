// @draft
"use client"

/**
 * @fileoverview Fullscreen image gallery lightbox with navigation.
 * @author Saasflare™
 * Opens images in a fullscreen overlay with prev/next navigation and
 * keyboard support. Supports images and video URLs.
 * @module packages/ui/components/ui/gallery-lightbox
 * @package ui
 *
 * @component
 * @example
 * import { GalleryLightbox } from '@saasflare/ui';
 * const [open, setOpen] = useState(false);
 * const [index, setIndex] = useState(0);
 * <GalleryLightbox
 *   images={["/img1.jpg", "/img2.jpg", "/img3.jpg"]}
 *   open={open}
 *   index={index}
 *   onClose={() => setOpen(false)}
 *   onIndexChange={setIndex}
 * />
 */

import { useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "../../lib/utils"

/** Props for the GalleryLightbox component. */
export interface GalleryLightboxProps {
  /** Array of image URLs. */
  images: string[]
  /** Whether the lightbox is open. */
  open: boolean
  /** Current image index. */
  index: number
  /** Called when the lightbox should close. */
  onClose: () => void
  /** Called when the index changes. */
  onIndexChange: (index: number) => void
  /** Additional class names. */
  className?: string
}

/**
 * Fullscreen image lightbox with keyboard navigation.
 *
 * @component
 * @package ui
 */
export function GalleryLightbox({
  images,
  open,
  index,
  onClose,
  onIndexChange,
  className,
}: GalleryLightboxProps) {
  const prev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const next = useCallback(() => {
    onIndexChange((index + 1) % images.length)
  }, [index, images.length, onIndexChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose, prev, next])

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm",
            className,
          )}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          data-slot="gallery-lightbox"
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <XIcon className="size-6" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
          )}

          {/* Image */}
          <motion.img
            key={index}
            src={images[index]}
            alt={`Image ${index + 1} of ${images.length}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {index + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
