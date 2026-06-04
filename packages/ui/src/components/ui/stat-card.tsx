"use client"

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
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Props for the StatCard component. */
export interface StatCardProps extends SaasflareComponentProps {
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
  surface,
  radius,
  animated,
  iconWeight,
}: StatCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  return (
    <div
      data-slot="stat-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      className={cn(
        "flex flex-col items-center rounded-xl border surface-card p-6 text-center",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        "motion-reduce:hover:transform-none",
        className,
      )}
    >
      {icon && (
        <div className="mb-3 text-primary [&_svg]:size-6">{icon}</div>
      )}
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
