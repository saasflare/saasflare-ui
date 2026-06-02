// @toreview
"use client"

/**
 * @fileoverview Saasflare Tabs — tabbed navigation with animated indicator.
 * @module packages/ui/components/ui/tabs
 * @layer core
 *
 * Self-contained implementation using Radix Tabs primitive directly.
 * The active-tab indicator is a single `m.div` inside `TabsList` that
 * animates `x`/`y`/`width`/`height` to track the active trigger via a
 * MutationObserver on `data-state`. No `LayoutGroup` — works under
 * `LazyMotion features={domAnimation}` strict mode.
 *
 * Layout indicator animation respects reduced-motion preference.
 *
 * @example
 * import { Tabs, TabsList, TabsTrigger, TabsContent } from "@saasflare/ui";
 * <Tabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="settings">Settings</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">...</TabsContent>
 *   <TabsContent value="settings">...</TabsContent>
 * </Tabs>
 */

import * as React from "react"
import { m } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, spring } from "./motion-config"

interface TabsProps
  extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function Tabs({
  className,
  orientation = "horizontal",
  surface,
  radius,
  animated,
  ...props
}: TabsProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <TabsPrimitive.Root
      {...props}
      data-slot="tabs"
      data-orientation={orientation}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface IndicatorPos {
  x: number
  y: number
  width: number
  height: number
}

interface TabsListProps
  extends Omit<
      React.ComponentProps<typeof TabsPrimitive.List>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps,
    VariantProps<typeof tabsListVariants> {}

function TabsList({
  className,
  variant = "default",
  children,
  surface,
  radius,
  animated,
  ...props
}: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const sf = useSaasflareProps({ surface, radius, animated })
  const motion = useSaasflareMotion(sf.animated, spring)
  const [pos, setPos] = React.useState<IndicatorPos | null>(null)

  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]'
      )
      if (!active) {
        setPos(null)
        return
      }
      const listRect = list.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const next: IndicatorPos = {
        x: activeRect.left - listRect.left,
        y: activeRect.top - listRect.top,
        width: activeRect.width,
        height: activeRect.height,
      }
      setPos((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next
      )
    }

    measure()

    const mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    })

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(list)

    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {pos !== null && (
        <m.div
          data-slot="tabs-indicator"
          aria-hidden
          initial={false}
          animate={{
            x: pos.x,
            y: pos.y,
            width: pos.width,
            height: pos.height,
          }}
          transition={motion.transition}
          className="pointer-events-none absolute top-0 left-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
          style={{ zIndex: 0 }}
        />
      )}
      {children}
    </TabsPrimitive.List>
  )
}

/**
 * Tab trigger. The active-tab indicator is rendered once at the
 * `TabsList` level and animates between triggers via measured position;
 * triggers themselves only own their content + state styling.
 *
 * @component
 * @layer core
 */
interface TabsTriggerProps
  extends Omit<
      React.ComponentProps<typeof TabsPrimitive.Trigger>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

function TabsTrigger({
  className,
  children,
  surface,
  radius,
  animated,
  ...props
}: TabsTriggerProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[state=active]:text-foreground dark:data-[state=active]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

interface TabsContentProps
  extends Omit<
      React.ComponentProps<typeof TabsPrimitive.Content>,
      keyof SaasflareComponentProps
    >,
    SaasflareComponentProps {}

function TabsContent({
  className,
  surface,
  radius,
  animated,
  ...props
}: TabsContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated })
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
}
