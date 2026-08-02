// @toreview
"use client"

/**
 * @fileoverview Saasflare PricingCard — plan display for pricing pages.
 * @module packages/ui/components/ui/pricing-card
 * @layer core
 *
 * Displays a pricing plan with name, price, feature list, and CTA button.
 * Supports a "featured" variant for highlighting the recommended plan.
 *
 * Features accept either a plain string or a descriptor, so a real pricing
 * table can show what a tier *does not* include and explain a limit inline
 * without the consumer rebuilding the list markup.
 *
 * @example
 * import { PricingCard } from "@saasflare/ui";
 *
 * <PricingCard
 *   name="Pro"
 *   price="$29"
 *   period="month"
 *   description="For growing teams"
 *   features={["Unlimited projects", "Priority support", "Analytics"]}
 *   cta={<Button>Get Started</Button>}
 *   featured
 * />
 *
 * @example
 * // Mixed list: tooltips and an excluded row
 * <PricingCard
 *   name="Free"
 *   price="$0"
 *   features={[
 *     "3 projects",
 *     { label: "5 seats", tooltip: "Invite teammates from Settings → Team." },
 *     { label: "API access", excluded: true },
 *   ]}
 * />
 */

import * as React from "react"
import { CheckIcon, InfoIcon, MinusIcon } from "./phosphor"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** A feature row with more to say than its label. */
interface PricingCardFeature {
  /** Feature label. */
  label: string
  /** Explanation shown behind an info icon. */
  tooltip?: string
  /** Render as *not* included — muted, struck through, minus icon. */
  excluded?: boolean
}

/** Props for the PricingCard component */
interface PricingCardProps extends Omit<React.ComponentProps<"div">, keyof SaasflareComponentProps>, SaasflareComponentProps {
  /** Plan name (e.g. "Starter", "Pro", "Enterprise") */
  name: string
  /** Formatted price (e.g. "$29", "Free", "$99") */
  price: string
  /** Billing period (e.g. "month", "year") */
  period?: string
  /** Short plan description */
  description?: string
  /**
   * Feature rows. Plain strings are treated as included features; use the
   * object form for a tooltip or to mark a feature as excluded.
   */
  features: ReadonlyArray<string | PricingCardFeature>
  /** CTA button element */
  cta?: React.ReactNode
  /** Highlight as recommended plan */
  featured?: boolean
  /**
   * Ribbon text on a featured card. Defaults to `"Recommended"`.
   * Set your own for other languages or a different message ("Best value").
   */
  badge?: React.ReactNode
}

/** Normalises the two accepted feature shapes into one. */
function toFeature(feature: string | PricingCardFeature): PricingCardFeature {
  return typeof feature === "string" ? { label: feature } : feature
}

/**
 * Mounts a TooltipProvider only when a tooltip is actually present, so a card
 * without tooltips stays free of the extra context — and a card *with* them
 * never crashes on a missing provider. Same pattern as SidebarProvider.
 */
function FeatureList({ children, hasTooltip }: { children: React.ReactNode; hasTooltip: boolean }) {
  const list = (
    <ul className="mt-6 space-y-2.5" role="list">
      {children}
    </ul>
  )
  return hasTooltip ? <TooltipProvider delayDuration={150}>{list}</TooltipProvider> : list
}

/**
 * Pricing plan card with features list and CTA.
 *
 * @component
 * @layer core
 *
 * @example
 * <PricingCard
 *   name="Enterprise"
 *   price="$99"
 *   period="month"
 *   description="For large organizations"
 *   features={["Everything in Pro", "SSO", "Custom integrations"]}
 *   cta={<Button variant="solid" intent="primary">Contact Sales</Button>}
 *   featured
 * />
 */
function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  featured = false,
  badge = "Recommended",
  className,
  surface,
  radius,
  animated,
  iconWeight,
  ...props
}: PricingCardProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const rows = features.map(toFeature)
  const hasTooltip = rows.some((row) => Boolean(row.tooltip))

  return (
    <div
      {...props}
      data-slot="pricing-card"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      data-featured={featured ? "true" : undefined}
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        featured && "border-primary shadow-md ring-1 ring-primary/20",
        className
      )}
    >
      {featured && badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          {badge}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight">{price}</span>
        {period && (
          <span className="text-sm text-muted-foreground">/{period}</span>
        )}
      </div>
      <FeatureList hasTooltip={hasTooltip}>
        {rows.map((feature) => {
          return (
            <li
              key={feature.label}
              data-excluded={feature.excluded ? "true" : undefined}
              className={cn(
                "flex items-start gap-2 text-sm",
                feature.excluded && "text-muted-foreground"
              )}
            >
              {feature.excluded ? (
                <MinusIcon
                  weight={sf.iconWeight}
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <CheckIcon
                  weight={sf.iconWeight}
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden="true"
                />
              )}
              <span className={cn(feature.excluded && "line-through decoration-muted-foreground/50")}>
                {feature.label}
              </span>
              {feature.tooltip && (
                <Tooltip>
                  <TooltipTrigger
                    // A button, not a bare icon: tooltips must be reachable
                    // by keyboard, and `aria-label` gives the trigger a name.
                    type="button"
                    aria-label={`More about ${feature.label}`}
                    className="mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <InfoIcon weight={sf.iconWeight} className="size-4 shrink-0" aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-56 text-wrap">{feature.tooltip}</TooltipContent>
                </Tooltip>
              )}
            </li>
          )
        })}
      </FeatureList>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  )
}

export { PricingCard, type PricingCardProps, type PricingCardFeature }
