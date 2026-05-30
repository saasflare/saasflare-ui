// @toreview
"use client"

/**
 * @fileoverview Saasflare SectionCard — titled card for settings and dashboard panels.
 * @module packages/core/components/ui/section-card
 * @layer core
 *
 * A card with a built-in header section (title + description)
 * and optional footer. Used for settings panels, dashboard sections,
 * and any grouped content that needs a labeled container.
 *
 * @example
 * import { SectionCard } from "@saasflare/ui";
 *
 * <SectionCard title="General" description="Basic project settings">
 *   <Input label="Project name" />
 * </SectionCard>
 */

import * as React from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the SectionCard component */
interface SectionCardProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Section title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Optional footer content (save button, etc.) */
  footer?: React.ReactNode
  /** Optional action in the header (edit button, etc.) */
  headerAction?: React.ReactNode
}

/**
 * Titled card section for settings panels and dashboard areas.
 *
 * @component
 * @layer core
 *
 * @param {string} title - Section title
 * @param {string} description - Optional description
 * @param {React.ReactNode} footer - Optional footer area
 * @param {React.ReactNode} headerAction - Optional action in header
 *
 * @example
 * <SectionCard
 *   title="Danger Zone"
 *   description="Irreversible actions for your project."
 *   footer={<Button intent="danger">Delete Project</Button>}
 * >
 *   <p>Once deleted, this project cannot be recovered.</p>
 * </SectionCard>
 */
function SectionCard({
  title,
  description,
  footer,
  headerAction,
  className,
  children,
  surface,
  radius,
  animated,
  ...props
}: SectionCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated })

  return (
    <div
      {...props}
      data-slot="section-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-none">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {headerAction && (
          <div className="shrink-0">{headerAction}</div>
        )}
      </div>
      <div data-slot="section-card-content" className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div
          data-slot="section-card-footer"
          className="flex items-center justify-end gap-2 border-t bg-muted/30 px-6 py-3"
        >
          {footer}
        </div>
      )}
    </div>
  )
}

export { SectionCard, type SectionCardProps }
