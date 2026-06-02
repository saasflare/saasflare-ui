// @reviewd 2026-05-15
"use client"

/**
 * @fileoverview Three-segment theme toggle (light / dark / system).
 *
 * Pill-shaped segmented control with Sun, Moon, and Monitor icons. Built on
 * the design-system `ToggleGroup` primitive (Pattern B — CSS-motion).
 *
 * Three appearances:
 *   - `"icon"` (default) — segments are small circles floating inside the
 *     rail. The active segment is filled with `--background` and a subtle
 *     ring. Segment shape is always pill, independent of the rail's
 *     `radius`.
 *   - `"icon-inherit"` — same compact icon footprint as `"icon"`, but each
 *     segment's border-radius matches the rail's `radius`. Use this when
 *     `radius="sharp"` should propagate to the segments too.
 *   - `"button"` — segments fill the rail end-to-end. The active segment
 *     matches the rail's outer corner radius on its outer edge and stays
 *     flat on its inner edge so it slots cleanly into the rail.
 *
 * The `radius` axis drives the rail's outer border-radius and is resolved
 * through `useSaasflareProps` (an explicit `radius` prop wins; this component
 * defaults to `"pill"` / `rounded-full`). Set `radius="sharp" | "soft" |
 * "rounded" | "pill"` — segment corners adapt automatically in
 * `"icon-inherit"` and `"button"` appearances.
 *
 * Supports `next-themes` natively. Renders `null` until hydrated to avoid
 * SSR/CSR mismatch on the active segment. When the System segment is
 * active, its `title` reflects the OS-resolved theme (e.g.
 * "System mode (currently dark)") so users see what their preference
 * resolves to.
 *
 * @module packages/ui/components/composed/theme-mode-multi-toggle
 * @package ui
 *
 * @component
 * @example
 * import { ThemeModeMultiToggle } from '@saasflare/ui';
 * <ThemeModeMultiToggle />
 *
 * @example
 * // Inherit-radius icons (segments adopt the rail's radius)
 * <ThemeModeMultiToggle appearance="icon-inherit" radius="sharp" />
 *
 * @example
 * // Button appearance with rounded geometry
 * <ThemeModeMultiToggle appearance="button" radius="rounded" />
 */

import * as React from "react"
import { useTheme } from "next-themes"
import {
  MonitorIcon,
  MoonIcon,
  SunIcon,
  ToggleGroup,
  ToggleGroupItem,
} from "../ui"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import type { Radius } from "../../types"

/** Available theme modes — mirrors next-themes' `theme` prop. */
type ThemeMode = "light" | "dark" | "system"

/** Visual appearance of the segments. */
type ThemeModeMultiToggleAppearance = "icon" | "icon-inherit" | "button"

interface ThemeModeMultiToggleProps extends SaasflareComponentProps {
  /** Override the default screen-reader labels per segment. */
  labels?: Partial<Record<ThemeMode, string>>
  /** Additional class names applied to the rail. */
  className?: string
  /** Segment size — matches the Toggle/ToggleGroup `size` axis. */
  size?: "sm" | "default" | "lg"
  /**
   * Visual appearance of the segments.
   *
   * - `"icon"` (default): small floating circles, always pill.
   * - `"icon-inherit"`: small floating shapes that match the rail's `radius`.
   * - `"button"`: segments fill the rail; outer corners match the rail's
   *   `radius`, inner corners stay flat so the segment slots in.
   *
   * @default "icon"
   */
  appearance?: ThemeModeMultiToggleAppearance
  /**
   * SSR-known theme mode (typically read from a cookie in the parent server
   * component). When provided, the component skips its internal mount-gate
   * and renders the matching segment as active on the very first paint —
   * eliminating the brief invisible / wrong-segment frame caused by
   * `next-themes` returning `undefined` during SSR.
   *
   * Leave undefined for the legacy mount-gated behaviour (renders `null`
   * until mounted).
   */
  initialMode?: ThemeMode
}

const DEFAULT_LABELS: Record<ThemeMode, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System mode",
}

/** Tailwind class for the rail's full border-radius per Radius preset. */
const RADIUS_CLASS: Record<Radius, string> = {
  sharp: "rounded-none",
  soft: "rounded-md",
  rounded: "rounded-lg",
  pill: "rounded-full",
}

/** Tailwind class for the left-only corners (used by `first:` selector in button mode). */
const RADIUS_LEFT_CLASS: Record<Radius, string> = {
  sharp: "first:rounded-l-none",
  soft: "first:rounded-l-md",
  rounded: "first:rounded-l-lg",
  pill: "first:rounded-l-full",
}

/** Tailwind class for the right-only corners (used by `last:` selector in button mode). */
const RADIUS_RIGHT_CLASS: Record<Radius, string> = {
  sharp: "last:rounded-r-none",
  soft: "last:rounded-r-md",
  rounded: "last:rounded-r-lg",
  pill: "last:rounded-r-full",
}

/**
 * Three-segment theme switcher (light / dark / system).
 *
 * @component
 * @layer ui
 */
export function ThemeModeMultiToggle({
  labels,
  className,
  size = "default",
  appearance = "icon",
  surface,
  radius,
  animated,
  iconWeight,
  initialMode,
}: ThemeModeMultiToggleProps): React.JSX.Element | null {
  const { theme, setTheme, resolvedTheme } = useTheme()
  // Route every axis (including radius) through the resolver so it stays the
  // single source of truth. This component's default radius is "pill"; we
  // express that as the resolver input's fallback so an explicit `radius`
  // prop still wins and `sf.radius` is the one value used everywhere below.
  const sf = useSaasflareProps({ surface, radius: radius ?? "pill", animated, iconWeight })
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Legacy mount-gated mode: callers that don't pass `initialMode` keep the
  // old null-until-mounted behaviour so the toggle never SSRs with a wrong
  // active segment. With `initialMode` supplied, we trust the caller — the
  // SSR active segment is correct from frame one, no flicker.
  if (initialMode === undefined && !mounted) {
    return null
  }

  const resolved: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : initialMode ?? "system"

  // `data-resolved-theme` is informational (hooks for CSS / debugging). On
  // SSR, next-themes' `resolvedTheme` is undefined, but the client mounts
  // with the persisted value already populated → attribute mismatch. Fall
  // back to `initialMode` when it's unambiguous (`"dark"` or `"light"`);
  // for `"system"` we'd need OS detection the server doesn't have, so we
  // leave it undefined and rely on `suppressHydrationWarning` below.
  const dataResolvedTheme =
    resolvedTheme ?? (initialMode === "dark" || initialMode === "light" ? initialMode : undefined)

  const baseLabel = (mode: ThemeMode) => labels?.[mode] ?? DEFAULT_LABELS[mode]

  // Enhance the System label with the OS-resolved theme so users see what
  // "system" actually means on their machine right now. Re-use the
  // `initialMode` fallback so this stays SSR-stable for unambiguous modes.
  const segmentLabel = (mode: ThemeMode): string => {
    const base = baseLabel(mode)
    if (mode === "system" && dataResolvedTheme && dataResolvedTheme !== "system") {
      return `${base} (currently ${dataResolvedTheme})`
    }
    return base
  }

  return (
    <ToggleGroup
      type="single"
      value={resolved}
      onValueChange={(next) => {
        if (next === "light" || next === "dark" || next === "system") {
          setTheme(next)
        }
      }}
      data-slot="theme-mode-multi-toggle"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      data-appearance={appearance}
      data-resolved-theme={dataResolvedTheme}
      // The System segment's title/aria-label embeds the OS-resolved theme
      // (`"System mode (currently dark)"`) which only exists on the client.
      // That's an attribute-text mismatch on the child button; suppress here
      // so React doesn't log a recoverable-error for it.
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center bg-muted",
        RADIUS_CLASS[sf.radius],
        appearance === "button" ? "gap-0 p-0" : "gap-1 p-1",
        className
      )}
    >
      <ThemeModeSegment
        mode="light"
        size={size}
        appearance={appearance}
        radius={sf.radius}
        label={segmentLabel("light")}
      >
        <SunIcon weight={sf.iconWeight} aria-hidden="true" />
      </ThemeModeSegment>
      <ThemeModeSegment
        mode="dark"
        size={size}
        appearance={appearance}
        radius={sf.radius}
        label={segmentLabel("dark")}
      >
        <MoonIcon weight={sf.iconWeight} aria-hidden="true" />
      </ThemeModeSegment>
      <ThemeModeSegment
        mode="system"
        size={size}
        appearance={appearance}
        radius={sf.radius}
        label={segmentLabel("system")}
      >
        <MonitorIcon weight={sf.iconWeight} aria-hidden="true" />
      </ThemeModeSegment>
    </ToggleGroup>
  )
}

interface ThemeModeSegmentProps {
  mode: ThemeMode
  size: "sm" | "default" | "lg"
  appearance: ThemeModeMultiToggleAppearance
  radius: Radius
  label: string
  children: React.ReactNode
}

function ThemeModeSegment({
  mode,
  size,
  appearance,
  radius,
  label,
  children,
}: ThemeModeSegmentProps): React.JSX.Element {
  // Shared visual-state classes across all appearances.
  // The active segment "pops" via scale + stronger shadow/ring and lifts above
  // its siblings with z-10 so the scaled edges don't get clipped by the rail.
  const stateClasses = cn(
    "relative cursor-pointer text-muted-foreground transition-all",
    "hover:bg-transparent hover:text-foreground",
    "data-[state=on]:z-10 data-[state=on]:bg-background data-[state=on]:text-foreground",
    "data-[state=on]:scale-110 data-[state=on]:shadow-md",
    "data-[state=on]:ring-1 data-[state=on]:ring-border",
    "data-[state=on]:[&_svg]:scale-110"
  )

  if (appearance === "button") {
    // Button appearance: segments fill the rail; outer corners match the rail.
    const sizeClass =
      size === "sm" ? "h-7 px-3 [&_svg:not([class*='size-'])]:size-3.5" :
      size === "lg" ? "h-10 px-5 [&_svg:not([class*='size-'])]:size-5" :
      "h-8 px-4 [&_svg:not([class*='size-'])]:size-4"

    return (
      <ToggleGroupItem
        value={mode}
        aria-label={label}
        title={label}
        className={cn(
          stateClasses,
          "rounded-none p-0 flex-1 min-w-0",
          RADIUS_LEFT_CLASS[radius],
          RADIUS_RIGHT_CLASS[radius],
          sizeClass
        )}
      >
        {children}
        <span className="sr-only">{label}</span>
      </ToggleGroupItem>
    )
  }

  // Icon appearance: small floating segment.
  // - "icon": always rounded-full
  // - "icon-inherit": adopts the rail's radius
  const iconRadiusClass =
    appearance === "icon-inherit" ? RADIUS_CLASS[radius] : "rounded-full"

  const sizeClass =
    size === "sm" ? "size-7 [&_svg:not([class*='size-'])]:size-3.5" :
    size === "lg" ? "size-10 [&_svg:not([class*='size-'])]:size-5" :
    "size-8 [&_svg:not([class*='size-'])]:size-4"

  return (
    <ToggleGroupItem
      value={mode}
      aria-label={label}
      title={label}
      className={cn(stateClasses, "p-0", iconRadiusClass, sizeClass)}
    >
      {children}
      <span className="sr-only">{label}</span>
    </ToggleGroupItem>
  )
}

export type { ThemeModeMultiToggleProps, ThemeModeMultiToggleAppearance }
