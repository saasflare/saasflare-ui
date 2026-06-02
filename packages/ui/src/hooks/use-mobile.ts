// @toreview
"use client"

/**
 * @fileoverview Hook to detect mobile viewport via media query.
 * @module packages/ui/hooks/use-mobile
 * @layer core
 *
 * Uses `matchMedia` to reactively track whether the viewport width
 * is below the mobile breakpoint (768px).
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) return <MobileNav />;
 * return <DesktopNav />;
 */

import * as React from "react"

/** Breakpoint in pixels below which the viewport is considered mobile */
const MOBILE_BREAKPOINT = 768

/**
 * Returns `true` when the viewport width is below 768px.
 *
 * @returns {boolean} Whether the current viewport is mobile-sized
 *
 * @example
 * const isMobile = useIsMobile();
 * <Sheet open={isMobile ? isOpen : undefined}>...</Sheet>
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
