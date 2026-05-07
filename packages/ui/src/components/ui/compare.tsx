// @draft
"use client"

/**
 * @fileoverview Before/after comparison slider.
 * @author Saasflare™
 * A draggable divider that reveals two overlapping images or components,
 * creating a before/after comparison effect.
 * @module packages/ui/components/ui/compare
 * @package ui
 *
 * @component
 * @example
 * import { Compare } from '@saasflare/ui';
 * <Compare
 *   before={<img src="/before.png" alt="Before" />}
 *   after={<img src="/after.png" alt="After" />}
 * />
 *
 * @example
 * // With labels and custom initial position
 * <Compare
 *   before={<img src="/old-design.png" alt="Old design" />}
 *   after={<img src="/new-design.png" alt="New design" />}
 *   beforeLabel="Before"
 *   afterLabel="After"
 *   initialPosition={30}
 * />
 */

import { useState, useRef, useCallback, type ReactNode, type PointerEvent } from "react"
import { cn } from "../../lib"

/** Props for the Compare component. */
export interface CompareProps {
  /** Content shown on the left (before) side. */
  before: ReactNode
  /** Content shown on the right (after) side. */
  after: ReactNode
  /** Label for the before side. */
  beforeLabel?: string
  /** Label for the after side. */
  afterLabel?: string
  /** Initial divider position as percentage (0–100). Default: `50` */
  initialPosition?: number
  /** CSS aspect-ratio for the container. Default: `"16/9"` */
  aspectRatio?: string
  /** Additional class names. */
  className?: string
}

/**
 * Draggable before/after comparison slider.
 *
 * - Pointer-based dragging (works on mouse and touch)
 * - Optional before/after labels
 * - Content is clipped, not resized
 * - Fully accessible with keyboard support
 *
 * @component
 * @package ui
 */
export function Compare({
  before,
  after,
  beforeLabel,
  afterLabel,
  initialPosition = 50,
  aspectRatio = "16/9",
  className,
}: CompareProps) {
  const [position, setPosition] = useState(initialPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition],
  )

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2))
    else if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2))
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-hidden rounded-xl border shadow-sm",
        className,
      )}
      style={{ aspectRatio }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-slot="compare"
    >
      {/* After (full width, behind) */}
      <div className="absolute inset-0">{after}</div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="h-full"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
        >
          {before}
        </div>
      </div>

      {/* Divider handle */}
      <div
        className="absolute inset-y-0 z-10 flex w-1 cursor-col-resize items-center bg-white shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        role="slider"
        aria-label="Comparison slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-white shadow-md">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M4 1L1 7L4 13M10 1L13 7L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      {beforeLabel && (
        <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {beforeLabel}
        </span>
      )}
      {afterLabel && (
        <span className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      )}
    </div>
  )
}
