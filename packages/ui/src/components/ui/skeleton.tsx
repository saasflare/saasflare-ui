// @toreview
"use client"

/**
 * @fileoverview Saasflare Skeleton — loading placeholder with shimmer effect.
 * @module packages/ui/components/ui/skeleton
 * @package ui
 *
 * Self-contained implementation. Shimmer keyframes defined in theme.css.
 * When reduced motion is preferred, shows a static gradient instead of shimmer.
 *
 * Radius via the optional `as` prop maps to the design-system scale so the
 * placeholder matches the component it stands in for. Without `as`, the
 * legacy `rounded-md` class is preserved (non-breaking).
 *
 * @example
 * import { Skeleton } from "@saasflare/ui";
 * <Skeleton as="text" className="h-4 w-48" />
 * <Skeleton as="avatar" className="h-12 w-12" />
 * <Skeleton as="card" className="h-40 w-full" />
 */

import type { CSSProperties } from "react"
import { cn } from "../../lib"

/** Component the skeleton imitates — drives radius from the design tokens. */
type SkeletonAs = "avatar" | "text" | "card"

interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Component shape to imitate. When set, radius follows the design-system
   * scale (and at `data-radius="pill"`, all variants collapse to fully rounded
   * automatically — see theme.css).
   *
   * - `avatar` → fully rounded
   * - `text`   → `--radius-sm`
   * - `card`   → `--radius-lg`
   *
   * Omit for legacy behavior (`rounded-md` Tailwind class).
   */
  as?: SkeletonAs
}

const RADIUS_BY_AS: Record<SkeletonAs, string> = {
  avatar: "9999px",
  text: "var(--radius-sm)",
  card: "var(--radius-lg)",
}

/**
 * Skeleton loading placeholder with animated shimmer gradient.
 *
 * @component
 * @package ui
 */
function Skeleton({ as, className, style, ...props }: SkeletonProps) {
  const radiusStyle: CSSProperties | undefined = as
    ? { borderRadius: RADIUS_BY_AS[as], ...style }
    : style
  return (
    <div
      data-slot="skeleton"
      className={cn(
        !as && "rounded-md",
        "bg-gradient-to-r from-accent/80 via-accent/40 to-accent/80 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:bg-accent/60",
        className,
      )}
      style={radiusStyle}
      {...props}
    />
  )
}

export { Skeleton }
