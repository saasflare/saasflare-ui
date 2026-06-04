// @toreview
"use client"

/**
 * @fileoverview Saasflare PageHeader — top-level page title with actions.
 * @module packages/ui/components/ui/page-header
 * @layer core
 *
 * Composed component for SaaS page headers with breadcrumbs,
 * title, description, and an action slot for buttons.
 *
 * @example
 * import { PageHeader } from "@saasflare/ui";
 *
 * <PageHeader
 *   title="Team Settings"
 *   description="Manage your team members and their permissions."
 *   actions={<Button>Invite Member</Button>}
 * />
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the PageHeader component */
interface PageHeaderProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Page title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Optional breadcrumb element rendered above the title */
  breadcrumbs?: React.ReactNode
  /** Action slot (buttons, etc.) aligned to the right */
  actions?: React.ReactNode
}

/**
 * Page header with title, description, breadcrumbs, and action slot.
 *
 * @component
 * @layer core
 *
 * @param {string} title - Page title text
 * @param {string} description - Optional subtitle / description
 * @param {React.ReactNode} breadcrumbs - Optional breadcrumb navigation
 * @param {React.ReactNode} actions - Action buttons aligned right
 *
 * @example
 * <PageHeader
 *   breadcrumbs={<Breadcrumb>...</Breadcrumb>}
 *   title="Billing"
 *   description="Manage your subscription and payment methods."
 *   actions={
 *     <>
 *       <Button variant="outline">Cancel Plan</Button>
 *       <Button>Upgrade</Button>
 *     </>
 *   }
 * />
 */
function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: PageHeaderProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

  return (
    <div
      {...props}
      data-slot="page-header"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn("flex flex-col gap-1", className)}
    >
      {breadcrumbs && (
        <div data-slot="page-header-breadcrumbs" className="mb-2">
          {breadcrumbs}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div data-slot="page-header-actions" className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export { PageHeader, type PageHeaderProps }
