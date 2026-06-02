"use client"

/**
 * @fileoverview AlertDialog — modal confirmation dialog with a Motion spring entry animation and backdrop fade.
 * @module packages/ui/components/ui/alert-dialog
 * @layer core
 *
 * Self-contained implementation built on Radix AlertDialog primitive with
 * Motion transitions. Overlay and content animations respect both the user's
 * reduced-motion preference and the resolved `animated` design-system axis.
 * Action and cancel buttons inherit the Saasflare button variant system.
 *
 * @component
 * @example
 * import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@saasflare/ui";
 *
 * <AlertDialog>
 *   <AlertDialogTrigger asChild><Button variant="outline" intent="danger">Delete</Button></AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
 *     <AlertDialogCancel>Cancel</AlertDialogCancel>
 *     <AlertDialogAction>Confirm</AlertDialogAction>
 *   </AlertDialogContent>
 * </AlertDialog>
 */

import * as React from "react"
import { m } from "motion/react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { useSaasflareMotion, springBouncy } from "./motion-config"
import { buttonVariants } from "./button"

/**
 * Root of the alert dialog. Controls open/close state for its trigger, overlay,
 * and content. Use for destructive or otherwise irreversible confirmations.
 */
function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

/** Element that opens the alert dialog when activated. Use `asChild` to wrap a custom control. */
function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

/** Portals the overlay and content into the document body, escaping overflow/stacking contexts. */
function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

/**
 * Blurred backdrop rendered behind the dialog content. Honors the resolved
 * `animated` axis via the `data-animated` attribute forwarded from
 * {@link AlertDialogContent}, so its fade is neutralized when motion is disabled.
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-foreground/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

interface AlertDialogContentProps
  extends Omit<React.ComponentProps<typeof AlertDialogPrimitive.Content>, keyof SaasflareComponentProps>,
    SaasflareComponentProps {}

/**
 * Centered dialog surface. The visible centerpiece of the alert dialog; resolves
 * the `surface`, `radius`, and `animated` design-system axes and emits the
 * matching `data-*` attributes on its root. The spring entry animation is gated
 * on the resolved `animated` axis (and reduced-motion preference).
 *
 * @example
 * <AlertDialog>
 *   <AlertDialogTrigger asChild><Button variant="outline" intent="danger">Delete</Button></AlertDialogTrigger>
 *   <AlertDialogContent surface="raised" radius="lg" animated>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Delete project?</AlertDialogTitle>
 *       <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction>Delete</AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 */
function AlertDialogContent({
  className,
  children,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: AlertDialogContentProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const motion = useSaasflareMotion(sf.animated, springBouncy)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay data-animated={String(sf.animated)} />
      <AlertDialogPrimitive.Content
        {...props}
        data-slot="alert-dialog-content"
        asChild
      >
        <m.div
          data-surface={sf.surface}
          data-radius={sf.radius}
          data-animated={String(sf.animated)}
          initial={motion.disabled ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={motion.disabled ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
          transition={motion.transition}
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
            className
          )}
        >
          {children}
        </m.div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

/** Layout slot for the dialog title and description; stacks centered on mobile, left-aligned on `sm+`. */
function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/** Layout slot for the action buttons; stacks reversed on mobile, right-aligned in a row on `sm+`. */
function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

/** Accessible title of the dialog, announced to assistive technology on open. */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

/** Supporting description of the dialog, linked as the accessible description of the content. */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Primary confirm button; closes the dialog and runs the destructive action. Styled with the solid button variant. */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      data-intent="primary"
      className={cn(buttonVariants({ variant: "solid" }), className)}
      {...props}
    />
  )
}

/** Dismiss button; closes the dialog without running the action. Styled with the outline button variant. */
function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      data-intent="neutral"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogContentProps,
}
