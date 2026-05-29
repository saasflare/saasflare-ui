// @toreview
"use client"

/**
 * @fileoverview Toaster primitive — themed toast notification container.
 * Built on the Sonner toast library with Phosphor icons and next-themes integration.
 * Part of the Saasflare base component layer.
 * @module packages/core/components/ui/sonner
 * @layer core
 *
 * @requires sonner — peer dependency.
 *
 * @component
 * @example
 * import { Toaster } from '@saasflare/ui';
 * <Toaster position="top-right" />
 */
"use client"

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

interface SaasflareToasterProps extends Omit<ToasterProps, keyof SaasflareComponentProps>, SaasflareComponentProps {}

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
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, type SaasflareToasterProps }
