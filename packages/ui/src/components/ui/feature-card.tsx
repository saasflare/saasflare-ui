// @draft
/**
 * @fileoverview Feature card with icon, title, and description.
 * @author Saasflare™
 * The most reused card pattern on any SaaS site. Simple and composable.
 * @module packages/ui/components/ui/feature-card
 * @package ui
 *
 * @component
 * @example
 * import { FeatureCard } from '@saasflare/ui';
 * <FeatureCard
 *   icon={<ZapIcon />}
 *   title="Lightning Fast"
 *   description="Deploy in under 30 seconds with zero configuration."
 * />
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"

/** Props for the FeatureCard component. */
export interface FeatureCardProps {
  /** Icon element displayed at the top. */
  icon?: ReactNode
  /** Feature title. */
  title: string
  /** Feature description text. */
  description: string
  /** Additional class names. */
  className?: string
}

/**
 * Feature card with icon, title, and description.
 *
 * @component
 * @package ui
 */
export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-subtle bg-glass-2 p-6",
        "transition-all duration-200 hover:border-border-hover hover:shadow-card-hover hover:-translate-y-px",
        "motion-reduce:hover:transform-none",
        className,
      )}
      data-slot="feature-card"
    >
      {icon && (
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
