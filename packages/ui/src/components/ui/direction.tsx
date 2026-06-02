"use client"

/**
 * @fileoverview Direction primitive — provides LTR/RTL direction context via Radix UI.
 * Wraps Radix DirectionProvider and useDirection hook for bidirectional layout support.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/direction
 * @layer core
 *
 * @component
 * @example
 * import { DirectionProvider, useDirection } from '@saasflare/ui';
 * <DirectionProvider dir="rtl">{children}</DirectionProvider>
 */

import * as React from "react"
import * as Direction from "@radix-ui/react-direction"

/**
 * Provides LTR/RTL text direction context to descendant components via Radix UI.
 * Renders no DOM of its own — only the direction context around its children.
 *
 * @param dir - The standard Radix direction (`"ltr"` | `"rtl"`).
 * @param direction - Convenience alias for `dir`; takes precedence when both are
 *   supplied (`direction ?? dir`). Prefer `dir`; this alias is kept for compatibility.
 * @example
 * <DirectionProvider dir="rtl">{children}</DirectionProvider>
 */
function DirectionProvider({
  dir,
  direction,
  children,
}: React.ComponentProps<typeof Direction.DirectionProvider> & {
  direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"]
}) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  )
}

/**
 * Reads the nearest LTR/RTL direction from context (re-exported from Radix UI).
 * Returns `"ltr"` when no {@link DirectionProvider} is present above in the tree.
 *
 * @example
 * const dir = useDirection();
 */
const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
