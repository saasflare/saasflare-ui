// @toreview
"use client"

/**
 * @fileoverview Saasflare Dialog — modal overlay with spring entry animation.
 * @module packages/ui/components/ui/dialog
 * @layer core
 *
 * Self-contained implementation using Radix Dialog primitive directly.
 * Entry animation (Motion spring) respects reduced-motion preference and the
 * `animated` axis; exit is handled by Radix CSS state classes because Radix
 * unmounts Content on close (no AnimatePresence wrapper keeps the node mounted).
 *
 * @example
 * import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@saasflare/ui";
 * <Dialog>
 *   <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
 *   </DialogContent>
 * </Dialog>
 */

import * as React from "react"
import { m } from "motion/react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "./phosphor"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"

/**
 * Dialog root. Controls open/close state for the modal.
 *
 * @component
 * @layer core
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

/**
 * Element that toggles the dialog open. Use `asChild` to compose with a Button.
 *
 * @component
 * @layer core
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

/**
 * Portals dialog content into the document body, escaping overflow/stacking contexts.
 *
 * @component
 * @layer core
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/**
 * Element that closes the dialog when activated. Use `asChild` to compose.
 *
 * @component
 * @layer core
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Backdrop scrim rendered behind the dialog content.
 *
 * @component
 * @layer core
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {
  /**
   * Render the built-in top-right close button (X).
   * @default true — preserves current behavior; set `false` to supply your own
   *                 DialogClose (e.g. command palettes, full-bleed media dialogs).
   *                 Esc-to-close and overlay-click-to-close remain active, so the
   *                 dialog stays escapable even when the button is hidden.
   */
  showCloseButton?: boolean
}

/**
 * Dialog content panel with spring entry animation.
 *
 * @component
 * @layer core
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: DialogContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        {...props}
        data-slot="dialog-content"
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={motion.transition}
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border surface-card p-6 sm:max-w-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
              <XIcon weight={sf.iconWeight} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </m.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

/**
 * Header region for the dialog title and description.
 *
 * @component
 * @layer core
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/**
 * Footer region for dialog actions (e.g. confirm/cancel buttons).
 *
 * @component
 * @layer core
 */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

/**
 * Accessible title for the dialog, announced to screen readers.
 *
 * @component
 * @layer core
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Accessible supporting description for the dialog.
 *
 * @component
 * @layer core
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
}
