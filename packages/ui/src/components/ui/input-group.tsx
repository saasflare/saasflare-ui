// @toreview
"use client"

/**
 * @fileoverview InputGroup primitive — composes an input with inline addons, buttons,
 * and prefix/suffix elements into a single visual unit. Supports focus, error, and
 * disabled states with consistent border and ring styling. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/input-group
 * @layer core
 *
 * @component
 * @example
 * import { InputGroup, InputGroupInput, InputGroupAddon } from '@saasflare/ui';
 * <InputGroup>
 *   <InputGroupAddon>$</InputGroupAddon>
 *   <InputGroupInput placeholder="Amount" />
 * </InputGroup>
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"

/** Props for {@link InputGroup}. Extends the Saasflare theme contract (surface/radius/animated). */
interface InputGroupProps
  extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * InputGroup — bordered container that visually unifies an input with inline
 * addons, buttons, and prefix/suffix text. Owns the focus ring, error styling,
 * and the theme axes (surface/radius/animated) for the whole group.
 *
 * @component
 * @example
 * <InputGroup>
 *   <InputGroupAddon>$</InputGroupAddon>
 *   <InputGroupInput placeholder="Amount" />
 * </InputGroup>
 */
function InputGroup({ className, surface, radius, animated, iconWeight, ...props }: InputGroupProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      data-slot="input-group"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      role="group"
      className={cn(
        "group/input-group relative flex w-full items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

/**
 * InputGroupAddon — non-interactive slot for icons, text, buttons, or kbd hints
 * placed inline or block-aligned around the control. Clicking the addon focuses
 * the sibling input (unless the click lands on a nested button), while still
 * running any consumer-supplied `onClick`.
 *
 * @component
 * @example <InputGroupAddon align="inline-end"><SearchIcon /></InputGroupAddon>
 */
function InputGroupAddon({
  className,
  align = "inline-start",
  onClick,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        onClick?.(e)
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

/**
 * InputGroupButton — compact {@link Button} sized to sit flush inside an
 * InputGroup. Defaults to a ghost variant and the `xs` group sizing. Inherits
 * Button's theme axes; the group-local `size` vocabulary drives only the inline
 * geometry via `inputGroupButtonVariants`.
 *
 * @component
 * @example <InputGroupButton size="icon-xs"><XIcon /></InputGroupButton>
 */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

/**
 * InputGroupText — muted inline text/label slot (e.g. units, prefixes) rendered
 * as a `<span>` inside an InputGroup.
 *
 * @component
 * @example <InputGroupText>https://</InputGroupText>
 */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * InputGroupInput — thin wrapper over {@link Input} stripped of its own border,
 * radius, and ring so it blends seamlessly into the surrounding InputGroup. The
 * theme axes (surface/radius/animated) are inherited from {@link Input}.
 *
 * @component
 * @example <InputGroupInput placeholder="Search" />
 */
function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

/**
 * InputGroupTextarea — thin wrapper over {@link Textarea} stripped of its own
 * border, radius, ring, and resize handle so it blends into the InputGroup. The
 * theme axes (surface/radius/animated) are inherited from {@link Textarea}.
 *
 * @component
 * @example <InputGroupTextarea placeholder="Notes" />
 */
function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  type InputGroupProps,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
