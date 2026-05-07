// @toreview
/**
 * @fileoverview Kbd primitive — renders keyboard shortcut keys with platform-aware
 * styling. Supports individual keys and grouped key combinations. Part of the
 * Saasflare base component layer.
 * @module packages/core/components/ui/kbd
 * @layer core
 *
 * @component
 * @example
 * import { Kbd, KbdGroup } from '@saasflare/core';
 * <KbdGroup><Kbd>Ctrl</Kbd><Kbd>S</Kbd></KbdGroup>
 */
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

interface KbdProps extends Omit<React.ComponentProps<"kbd">, keyof SaasflareComponentProps>, SaasflareComponentProps {}

function Kbd({ className, surface, radius, animated, ...props }: KbdProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

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

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup, type KbdProps }
