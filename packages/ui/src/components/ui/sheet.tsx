// @toreview
"use client"

/**
 * @fileoverview Sheet primitive — slide-in panel overlay from any edge of the viewport.
 * Built on Radix UI Dialog. Part of the Saasflare base component layer.
 * @module packages/ui/components/ui/sheet
 * @layer core
 *
 * @component
 * @example
 * import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@saasflare/ui';
 * <Sheet>
 *   <SheetTrigger>Open</SheetTrigger>
 *   <SheetContent side="right">
 *     <SheetHeader>
 *       <SheetTitle>Sheet Title</SheetTitle>
 *       <SheetDescription>Sheet description text.</SheetDescription>
 *     </SheetHeader>
 *   </SheetContent>
 * </Sheet>
 */

import * as React from "react"
import { XIcon } from "./phosphor"
import * as SheetPrimitive from "@radix-ui/react-dialog"

import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/**
 * Slide-in panel overlay that enters from an edge of the viewport. Built on
 * Radix Dialog — owns open state, focus trapping, and dismissal. Compose with
 * {@link SheetTrigger} and {@link SheetContent}; use it for side navigation,
 * filters, or detail panels that should not leave the current page.
 *
 * @component
 * @layer core
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/**
 * Button that opens the sheet.
 *
 * @component
 * @layer core
 */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/**
 * Button that closes the sheet from anywhere inside it.
 *
 * @component
 * @layer core
 */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Props for {@link SheetContent}.
 *
 * `side` picks the viewport edge the panel slides in from (default `"right"`);
 * `showCloseButton` toggles the built-in top-right close button.
 */
interface SheetContentProps
  extends Omit<React.ComponentProps<typeof SheetPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}

/**
 * The sliding panel itself — portaled behind a dimmed overlay, slides in from
 * the chosen `side`, and renders an optional built-in close button.
 *
 * @component
 * @layer core
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: SheetContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <SheetPortal>
      <SheetOverlay data-animated={String(sf.animated)} />
      <SheetPrimitive.Content
        {...props}
        data-slot="sheet-content"
        data-surface={sf.surface}
        data-radius={sf.radius}
        data-animated={String(sf.animated)}
        className={cn(
          "fixed z-50 flex flex-col gap-4 surface-card transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        )}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary data-[state=open]:text-secondary-foreground">
            <XIcon weight={sf.iconWeight} className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/**
 * Sheet header — stacks {@link SheetTitle} and {@link SheetDescription} at the
 * top of the panel.
 *
 * @component
 * @layer core
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

/**
 * Sheet footer — actions area pinned to the bottom of the panel.
 *
 * @component
 * @layer core
 */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/**
 * Accessible sheet title — announced to screen readers when the sheet opens.
 *
 * @component
 * @layer core
 */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Accessible sheet description text below the title.
 *
 * @component
 * @layer core
 */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
}
