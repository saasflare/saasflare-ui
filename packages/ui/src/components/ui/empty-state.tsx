// @toreview
"use client"

/**
 * @fileoverview Saasflare EmptyState — placeholder for empty views.
 * @module packages/core/components/ui/empty-state
 * @layer core
 *
 * Displays a centered icon/illustration, title, description, and optional
 * action button when a list, table, or section has no data.
 *
 * @example
 * import { EmptyState } from "@saasflare/core";
 * import { InboxIcon } from "lucide-react";
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

/** Props for the EmptyState component */
interface EmptyStateProps extends React.ComponentProps<"div"> {
  /** Icon or illustration element */
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
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      {...props}
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
