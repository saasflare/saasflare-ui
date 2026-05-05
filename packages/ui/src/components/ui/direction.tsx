// @toreview
/**
 * @fileoverview Direction primitive — provides LTR/RTL direction context via Radix UI.
 * Wraps Radix DirectionProvider and useDirection hook for bidirectional layout support.
 * Part of the Saasflare base component layer.
 * @module packages/core/components/ui/direction
 * @layer core
 *
 * @component
 * @example
 * import { DirectionProvider, useDirection } from '@saasflare/core';
 * <DirectionProvider dir="rtl">{children}</DirectionProvider>
 */
"use client"

import * as React from "react"
import { Direction } from "radix-ui"

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

const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
