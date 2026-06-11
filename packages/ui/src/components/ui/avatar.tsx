// @toreview
"use client"

/**
 * @fileoverview Avatar — user profile image with size variants and hover scale animation.
 * @module packages/ui/components/ui/avatar
 * @layer core
 *
 * Self-contained implementation built on Radix Avatar primitive. Supports
 * three size variants (sm, default, lg) and includes a subtle hover scale
 * transition. Provides fallback initials when the image fails to load.
 *
 * @component
 * @example
 * import { Avatar, AvatarImage, AvatarFallback } from "@saasflare/ui";
 *
 * <Avatar size="lg">
 *   <AvatarImage src="/user.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Props for {@link Avatar}.
 *
 * Extends the Radix Avatar root props and {@link SaasflareComponentProps} so
 * `surface`, `radius`, `animated`, and `iconWeight` can be supplied
 * per-instance or inherited from <SaasflareProvider>.
 */
interface AvatarProps
  extends Omit<React.ComponentProps<typeof AvatarPrimitive.Root>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Visual size. `"default"` is a deprecated alias for `"md"`. */
  size?: "sm" | "md" | "lg" | "default"
}

/**
 * User avatar with size variants and a subtle hover-scale animation. Built on
 * the Radix Avatar primitive — compose with {@link AvatarImage} and
 * {@link AvatarFallback}; wrap several in {@link AvatarGroup} for an
 * overlapping stack.
 *
 * @component
 * @layer core
 *
 * @example
 * <Avatar size="lg">
 *   <AvatarImage src="/user.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 */
function Avatar({
  className,
  size = "md",
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: AvatarProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const resolvedSize = size === "default" ? "md" : size

  return (
    <AvatarPrimitive.Root
      {...props}
      data-slot="avatar"
      data-size={resolvedSize}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none transition-transform duration-200 data-[animated=true]:hover:scale-105 data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      )}
    />
  )
}

/**
 * Avatar image — fills the circle once the source has loaded; until then
 * {@link AvatarFallback} renders.
 *
 * @component
 * @layer core
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Fallback initials shown while the avatar image loads or when it fails.
 *
 * @component
 * @layer core
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * Status badge anchored to the avatar's bottom-right corner, scaled to the
 * avatar size.
 *
 * @component
 * @layer core
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * Overlapping stack of avatars separated by background-colored rings.
 *
 * @component
 * @layer core
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

/**
 * Overflow count bubble (e.g. "+3") rendered at the end of an
 * {@link AvatarGroup}.
 *
 * @component
 * @layer core
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  type AvatarProps,
}
