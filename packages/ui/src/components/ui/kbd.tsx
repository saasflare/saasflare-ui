// @toreview
"use client"

/**
 * @fileoverview Kbd primitive — renders keyboard shortcut keys with platform-aware
 * styling. Supports individual keys and grouped key combinations. Part of the
 * Saasflare base component layer.
 * @module packages/ui/components/ui/kbd
 * @layer core
 *
 * @component
 * @example
 * import { Kbd, KbdGroup } from '@saasflare/ui';
 * <KbdGroup><Kbd>Ctrl</Kbd><Kbd>S</Kbd></KbdGroup>
 */
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface KbdProps extends Omit<React.ComponentProps<"kbd">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Kbd({ className, surface, radius, animated, iconWeight, ...props }: KbdProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <kbd
      {...props}
      data-slot="kbd"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
    />
  )
}

interface KbdGroupProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

function KbdGroup({ className, surface, radius, animated, iconWeight, ...props }: KbdGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      {...props}
      data-slot="kbd-group"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("inline-flex items-center gap-1", className)}
    />
  )
}

export { Kbd, KbdGroup, type KbdProps }
