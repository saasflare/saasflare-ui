// @toreview
"use client"

/**
 * @fileoverview Saasflare PricingCard — plan display for pricing pages.
 * @module packages/core/components/ui/pricing-card
 * @layer core
 *
 * Displays a pricing plan with name, price, feature list, and CTA button.
 * Supports a "featured" variant for highlighting the recommended plan.
 *
 * @example
 * import { PricingCard } from "@saasflare/core";
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
 */

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "../../lib"

/** Props for the PricingCard component */
interface PricingCardProps extends React.ComponentProps<"div"> {
  /** Plan name (e.g. "Starter", "Pro", "Enterprise") */
  name: string
  /** Formatted price (e.g. "$29", "Free", "$99") */
  price: string
  /** Billing period (e.g. "month", "year") */
  period?: string
  /** Short plan description */
  description?: string
  /** List of included features */
  features: string[]
  /** CTA button element */
  cta?: React.ReactNode
  /** Highlight as recommended plan */
  featured?: boolean
}

/**
 * Pricing plan card with features list and CTA.
 *
 * @component
 * @layer core
 *
 * @param {string} name - Plan name
 * @param {string} price - Formatted price string
 * @param {string} period - Billing period
 * @param {string} description - Short description
 * @param {string[]} features - List of features
 * @param {React.ReactNode} cta - Call-to-action button
 * @param {boolean} featured - Highlight styling
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
  className,
  ...props
}: PricingCardProps) {
  return (
    <div
      data-slot="pricing-card"
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        featured && "border-primary shadow-md ring-1 ring-primary/20",
        className
      )}
      {...props}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Recommended
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
      <ul className="mt-6 space-y-2.5" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  )
}

export { PricingCard, type PricingCardProps }
