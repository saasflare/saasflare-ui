// @draft
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

import { Children, type ReactNode, type ReactElement } from "react"
import { cn } from "../../lib/utils"

/** Props for the Steps container. */
export interface StepsProps {
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
}: StepsProps) {
  const items = Children.toArray(children) as ReactElement<StepProps>[]

  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row items-start" : "flex-col",
        className,
      )}
      data-slot="steps"
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
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  (child.props as StepProps).icon ?? i + 1
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
                {(child.props as StepProps).title}
              </p>
              {(child.props as StepProps).description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {(child.props as StepProps).description}
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
