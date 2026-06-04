// @toreview
"use client"

/**
 * @fileoverview ButtonGroup primitive — groups multiple buttons or inputs into a
 * visually connected strip with shared border radii and separator support.
 * Supports horizontal and vertical orientations. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/button-group
 * @layer core
 *
 * @component
 * @example
 * import { ButtonGroup, ButtonGroupText } from '@saasflare/ui';
 * <ButtonGroup orientation="horizontal">
 *   <ButtonGroupText>Left</ButtonGroupText>
 *   <ButtonGroupText>Right</ButtonGroupText>
 * </ButtonGroup>
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as Slot from "@radix-ui/react-slot"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Separator } from "./separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

interface ButtonGroupProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    VariantProps<typeof buttonGroupVariants>,
    SaasflareComponentProps {}

/**
 * Groups multiple buttons or inputs into a visually connected strip with shared
 * border radii. The `radius` axis drives the corner rounding of the whole group;
 * connected edges between children have their adjacent corners flattened.
 *
 * @example
 * <ButtonGroup orientation="horizontal" radius="lg">
 *   <Button>Left</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 */
function ButtonGroup({
  className,
  orientation = "horizontal",
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ButtonGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

interface ButtonGroupTextProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /** Render as the child element via Radix Slot instead of a `div`. */
  asChild?: boolean
}

/**
 * A bordered, muted-surface text/label cell for use inside a {@link ButtonGroup}
 * (e.g. an inline prefix/suffix). Carries its own `surface` and `radius` axes so
 * it visually matches the connected controls around it.
 *
 * @example
 * <ButtonGroup>
 *   <ButtonGroupText>https://</ButtonGroupText>
 *   <Input placeholder="example.com" />
 * </ButtonGroup>
 */
function ButtonGroupText({
  className,
  asChild = false,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: ButtonGroupTextProps) {
  const Comp = asChild ? Slot.Root : "div"
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <Comp
      data-slot="button-group-text"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * A divider between segments of a {@link ButtonGroup}. Defaults to a vertical
 * orientation to suit the default horizontal group layout. Forwards all props to
 * the underlying {@link Separator}.
 *
 * @example
 * <ButtonGroup>
 *   <Button>Cut</Button>
 *   <ButtonGroupSeparator />
 *   <Button>Copy</Button>
 * </ButtonGroup>
 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative m-0! self-stretch bg-input data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  type ButtonGroupProps,
  ButtonGroupSeparator,
  ButtonGroupText,
  type ButtonGroupTextProps,
  buttonGroupVariants,
}
