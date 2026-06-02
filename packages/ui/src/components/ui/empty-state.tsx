// @toreview
"use client"

/**
 * @fileoverview Saasflare EmptyState — placeholder for empty views.
 * @module packages/ui/components/ui/empty-state
 * @layer core
 *
 * Displays a centered icon/illustration, title, description, and optional
 * action button when a list, table, or section has no data.
 *
 * @example
 * import { EmptyState } from "@saasflare/ui";
 * import { InboxIcon } from "./phosphor";
 *
 * <EmptyState
 *   icon={<InboxIcon />}
 *   title="No messages"
 *   description="You haven't received any messages yet."
 *   action={<Button>Compose</Button>}
 * />
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the EmptyState component */
interface EmptyStateProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /**
   * Icon or illustration element. Rendered verbatim — because this is an
   * arbitrary `ReactNode` rather than an internal Phosphor icon, the
   * provider's `iconWeight` does not reach it. Set `weight` on the icon
   * you pass (e.g. `<InboxIcon weight="duotone" />`) for weight control.
   */
  icon?: React.ReactNode
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Action element (button, link, etc.) */
  action?: React.ReactNode
}

/**
 * Empty state placeholder with icon, text, and call-to-action.
 *
 * @component
 * @layer core
 *
 * @param {React.ReactNode} icon - Icon or illustration
 * @param {string} title - Title text
 * @param {string} description - Description text
 * @param {React.ReactNode} action - Optional CTA button
 *
 * @example
 * <EmptyState
 *   icon={<FileIcon className="size-12" />}
 *   title="No documents"
 *   description="Upload your first document to get started."
 *   action={<Button>Upload File</Button>}
 * />
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: EmptyStateProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      {...props}
      data-slot="empty-state"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="text-muted-foreground [&_svg]:size-12">{icon}</div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export { EmptyState, type EmptyStateProps }
