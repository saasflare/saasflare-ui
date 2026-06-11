// @toreview
"use client"

/**
 * @fileoverview Toaster primitive — themed toast notification container.
 * Built on the Sonner toast library with Phosphor icons and next-themes integration.
 * Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/sonner
 * @layer core
 *
 * @requires sonner — peer dependency.
 *
 * @component
 * @example
 * import { Toaster } from '@saasflare/ui';
 * <Toaster position="top-right" />
 */

import type { CSSProperties } from "react"
import {
  CheckCircleIcon,
  InfoIcon,
  CircleNotchIcon,
  XCircleIcon,
  WarningIcon,
} from "./phosphor"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Toaster}.
 *
 * Extends Sonner's `ToasterProps` (`position`, `duration`, …) with
 * {@link SaasflareComponentProps}, so `iconWeight` and the other axes can be
 * supplied per-instance or inherited from <SaasflareProvider>.
 */
interface SaasflareToasterProps extends Omit<ToasterProps, keyof SaasflareComponentProps>, SaasflareComponentProps {}

/**
 * Toast notification container built on Sonner. Mount once near the app root,
 * then fire toasts with Sonner's `toast()` API. Follows the next-themes color
 * scheme and swaps Sonner's default status icons for Phosphor equivalents.
 *
 * @component
 * @layer core
 *
 * @example
 * <Toaster position="top-right" />
 */
const Toaster = ({ surface, radius, animated, iconWeight, ...props }: SaasflareToasterProps) => {
  const { theme = "system" } = useTheme()
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <Sonner
      data-slot="toaster"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon weight={sf.iconWeight} className="size-4" />,
        info: <InfoIcon weight={sf.iconWeight} className="size-4" />,
        warning: <WarningIcon weight={sf.iconWeight} className="size-4" />,
        error: <XCircleIcon weight={sf.iconWeight} className="size-4" />,
        loading: <CircleNotchIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      {...props}
    />
  )
}

/**
 * Sonner's imperative toast API, re-exported so consumers and the mounted
 * {@link Toaster} are guaranteed to share ONE sonner module instance.
 * Importing `toast` from "sonner" directly can resolve to a second copy
 * (separate toast state) under isolated installs — always import it from
 * `@saasflare/ui` instead.
 */
export { toast } from "sonner"

export { Toaster, type SaasflareToasterProps }
