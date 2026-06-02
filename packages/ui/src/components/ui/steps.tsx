"use client"

/**
 * @fileoverview Numbered step indicator with connector lines.
 * @author Saasflare™
 * A horizontal or vertical step sequence showing progress through stages.
 * Pure visual — no form/wizard logic.
 * @module packages/ui/components/ui/steps
 * @package ui
 *
 * @component
 * @example
 * import { Steps, Step } from '@saasflare/ui';
 * <Steps current={1}>
 *   <Step title="Sign Up" />
 *   <Step title="Configure" />
 *   <Step title="Deploy" />
 * </Steps>
 */

import { Children, isValidElement, type ReactNode, type ReactElement } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"
import { CheckIcon } from "./phosphor"

/** Props for the Steps container. */
export interface StepsProps extends SaasflareComponentProps {
  /** Step children. */
  children: ReactNode
  /** Index of the current active step (0-based). Default: `0` */
  current?: number
  /** Layout direction. Default: `"horizontal"` */
  direction?: "horizontal" | "vertical"
  /** Additional class names. */
  className?: string
}

/** Props for an individual Step. */
export interface StepProps {
  /** Step title text. */
  title: string
  /** Optional description below the title. */
  description?: string
  /** Optional icon to replace the step number. */
  icon?: ReactNode
  /**
   * Marks the step as skippable. Purely cosmetic here — renders a small
   * "Optional" sub-label beneath the title. Consumed by `Stepper` to infer its
   * `optional` step indices. Default: `false`
   */
  optional?: boolean
  /** Additional class names. */
  className?: string
}

/**
 * Step sequence indicator with numbered circles and connector lines.
 *
 * @component
 * @package ui
 */
export function Steps({
  children,
  current = 0,
  direction = "horizontal",
  className,
  surface,
  radius,
  animated,
  iconWeight,
}: StepsProps) {
  const sf = useSaasflareProps({ surface, radius, animated, iconWeight })
  const items = Children.toArray(children).filter(
    (c): c is ReactElement<StepProps> => isValidElement(c) && c.type === Step,
  )

  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row items-start" : "flex-col",
        className,
      )}
      data-slot="steps"
      data-surface={sf.surface}
      data-radius={sf.radius}
      data-animated={String(sf.animated)}
      role="list"
    >
      {items.map((child, i) => {
        const status = i < current ? "completed" : i === current ? "active" : "pending"
        const isLast = i === items.length - 1

        return (
          <div
            key={i}
            className={cn(
              "flex",
              direction === "horizontal"
                ? "flex-1 flex-col items-center"
                : "flex-row gap-4",
            )}
            role="listitem"
            aria-current={status === "active" ? "step" : undefined}
          >
            <div className={cn(
              "flex items-center",
              direction === "horizontal" ? "w-full" : "flex-col",
            )}>
              {/* Circle */}
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  status === "completed" && "border-primary bg-primary text-primary-foreground",
                  status === "active" && "border-primary bg-background text-primary",
                  status === "pending" && "border-muted-foreground/30 bg-background text-muted-foreground",
                )}
              >
                {status === "completed" ? (
                  <CheckIcon className="size-4" weight={sf.iconWeight} aria-hidden="true" />
                ) : (
                  child.props.icon ?? i + 1
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    direction === "horizontal"
                      ? "h-0.5 flex-1"
                      : "w-0.5 min-h-8 flex-1",
                    status === "completed" ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>

            {/* Text */}
            <div className={cn(
              direction === "horizontal" ? "mt-2 text-center" : "pb-8",
            )}>
              <p className={cn(
                "text-sm font-medium",
                status === "pending" && "text-muted-foreground",
              )}>
                {child.props.title}
              </p>
              {child.props.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {child.props.description}
                </p>
              )}
              {child.props.optional && (
                <p className="mt-0.5 text-xs text-muted-foreground/70 italic">
                  Optional
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Individual step within a Steps container.
 * This component is a data carrier — it renders nothing on its own.
 *
 * @component
 * @package ui
 */
export function Step(_props: StepProps) {
  return null
}
