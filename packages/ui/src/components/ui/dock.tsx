// @draft
"use client"

/**
 * @fileoverview macOS-style dock with magnification effect.
 * @author Saasflare™
 * Renders a horizontal dock bar where items magnify on mouse proximity.
 * Uses Framer Motion springs for smooth scaling with natural physics.
 * @module packages/ui/components/ui/dock
 * @package ui
 *
 * @component
 * @example
 * import { Dock, DockItem } from '@saasflare/ui';
 * <Dock>
 *   <DockItem label="Home"><HomeIcon className="size-6" /></DockItem>
 *   <DockItem label="Search"><SearchIcon className="size-6" /></DockItem>
 *   <DockItem label="Settings"><SettingsIcon className="size-6" /></DockItem>
 * </Dock>
 *
 * @example
 * // Custom magnification range
 * <Dock magnification={1.8} distance={120}>
 *   {navItems.map(item => (
 *     <DockItem key={item.id} label={item.name} onClick={item.action}>
 *       {item.icon}
 *     </DockItem>
 *   ))}
 * </Dock>
 */

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react"
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import { cn } from "../../lib"
import { useReducedMotion } from "./motion-config"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/* ── Dock context ── */

interface DockContextValue {
  mouseX: MotionValue<number>
  magnification: number
  distance: number
  reduced: boolean
}

const DockContext = createContext<DockContextValue | null>(null)

function useDock(): DockContextValue {
  const ctx = useContext(DockContext)
  if (!ctx) throw new Error("DockItem must be used within a Dock")
  return ctx
}

/* ── Dock ── */

/** Props for the Dock container. */
export interface DockProps extends SaasflareComponentProps {
  /** Dock items. */
  children: ReactNode
  /** Maximum scale factor for magnified items. Default: `1.5` */
  magnification?: number
  /** Mouse proximity distance in pixels that triggers magnification. Default: `100` */
  distance?: number
  /** Additional class names. */
  className?: string
}

/**
 * Horizontal dock bar with proximity-based item magnification.
 *
 * - Items scale up as the mouse approaches them
 * - Uses spring physics for smooth, elastic scaling
 * - Falls back to a static icon bar when reduced motion is preferred
 * - Tracks mouse X position across the entire dock
 *
 * @component
 * @package ui
 */
export function Dock({
  children,
  magnification = 1.5,
  distance = 100,
  className,
  surface,
  radius,
  animated,
}: DockProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  const reduced = useReducedMotion()
  const mouseX = useMotionValue(Infinity)

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance, reduced }}>
      <m.nav
        onMouseMove={(e: ReactMouseEvent) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        data-slot="dock"
        data-surface={sf.surface}
        data-radius={sf.radius}
        className={cn(
          "mx-auto flex h-14 items-end gap-2 rounded-2xl border surface-card px-3 pb-2",
          className,
        )}
        role="toolbar"
        aria-label="Dock"
      >
        {children}
      </m.nav>
    </DockContext.Provider>
  )
}

/* ── DockItem ── */

/** Props for a DockItem. */
export interface DockItemProps {
  /** Icon or content inside the dock item. */
  children: ReactNode
  /** Tooltip label for the item. */
  label: string
  /** Click handler. */
  onClick?: () => void
  /** Additional class names. */
  className?: string
}

/** Base icon size in pixels. */
const BASE_SIZE = 40

/**
 * Individual item within a Dock.
 *
 * - Magnifies based on mouse proximity using spring interpolation
 * - Shows a tooltip label on hover
 * - Renders at static base size when reduced motion is preferred
 *
 * @component
 * @package ui
 */
export function DockItem({
  children,
  label,
  onClick,
  className,
}: DockItemProps) {
  const { mouseX, magnification, distance, reduced } = useDock()
  const ref = useRef<HTMLButtonElement>(null)

  const distanceFromMouse = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return distance + 1
    return val - (bounds.x + bounds.width / 2)
  })

  const maxSize = BASE_SIZE * magnification

  const sizeTransform = useTransform(
    distanceFromMouse,
    [-distance, 0, distance],
    [BASE_SIZE, maxSize, BASE_SIZE],
  )

  const size = useSpring(sizeTransform, { stiffness: 300, damping: 25 })

  return (
    <m.button
      ref={ref}
      onClick={onClick}
      style={reduced ? { width: BASE_SIZE, height: BASE_SIZE } : { width: size, height: size }}
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-muted transition-colors hover:bg-muted/80",
        "group",
        className,
      )}
      aria-label={label}
      data-slot="dock-item"
    >
      {children}

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </m.button>
  )
}
