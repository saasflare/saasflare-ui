// @draft
/**
 * @fileoverview Statistic card with number, label, and optional icon.
 * @author Saasflare™
 * Complements the existing MetricCard with a simpler, marketing-focused
 * variant for stats sections ("10K+ users", "99.9% uptime").
 * @module packages/ui/components/ui/stat-card
 * @package ui
 *
 * @component
 * @example
 * import { StatCard } from '@saasflare/ui';
 * <StatCard value="10K+" label="Active Users" />
 *
 * @example
 * <StatCard value="99.9%" label="Uptime" icon={<ShieldIcon />} />
 */

import { type ReactNode } from "react"
import { cn } from "../../lib/utils"

/** Props for the StatCard component. */
export interface StatCardProps {
  /** The stat value (e.g. "10K+", "99.9%", "$2.4M"). */
  value: string
  /** Label describing the stat. */
  label: string
  /** Optional icon displayed above the value. */
  icon?: ReactNode
  /** Additional class names. */
  className?: string
}

/**
 * Simple statistic display card for marketing sections.
 *
 * @component
 * @package ui
 */
export function StatCard({
  value,
  label,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-card border border-border-subtle bg-glass-2 p-6 text-center",
        "transition-all duration-200 hover:border-border-hover hover:shadow-card-hover hover:-translate-y-px",
        "motion-reduce:hover:transform-none",
        className,
      )}
      data-slot="stat-card"
    >
      {icon && (
        <div className="mb-3 text-primary [&_svg]:size-6">{icon}</div>
      )}
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
