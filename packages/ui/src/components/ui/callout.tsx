// @draft
"use client"

/**
 * @fileoverview Saasflare Callout — emphasized info / warning / success box.
 * @author Saasflare™
 *
 * Sits between Alert (passive page-level notification) and Dialog (modal
 * interruption). A callout reads as "pay attention to this paragraph"
 * inside flowing content — common in docs, onboarding screens, and
 * inline form guidance.
 *
 * @module packages/ui/components/ui/callout
 * @package ui
 * @layer core
 *
 * @example
 * <Callout intent="warning" title="Heads up">
 *   This action is irreversible. Make sure you've exported your data first.
 * </Callout>
 */

import { type ReactNode } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

const INTENTS = ["primary", "neutral", "success", "warning", "danger", "info"] as const
export type CalloutIntent = (typeof INTENTS)[number]

/** Props for the Callout component. */
export interface CalloutProps extends SaasflareComponentProps {
    /** Color intent. Default: `"info"`. */
    intent?: CalloutIntent
    /** Bold title rendered above the body. */
    title?: ReactNode
    /** Leading icon (rendered in the same color as the intent stripe). */
    icon?: ReactNode
    /** Body content. */
    children?: ReactNode
    /** Additional class names. */
    className?: string
}

/**
 * Inline emphasized message box with intent-driven coloring.
 *
 * @component
 * @layer core
 *
 * @example
 * <Callout intent="success" title="Saved">Your changes are live.</Callout>
 */
export function Callout({
    intent = "info",
    title,
    icon,
    children,
    className,
    surface,
    radius,
    animated,
    iconWeight,
}: CalloutProps) {
    const sf = useSaasflareProps({ surface, radius, animated, iconWeight })

    return (
        <div
            data-slot="callout"
            data-intent={intent}
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            role="note"
            className={cn(
                "relative flex gap-3 rounded-lg border-l-4 p-4",
                "border-l-[var(--intent)] bg-[var(--intent)]/8",
                "text-foreground",
                "[&_a]:underline [&_a]:underline-offset-2 [&_a]:text-[var(--intent-text)]",
                className,
            )}
        >
            {icon !== undefined && (
                <div
                    data-slot="callout-icon"
                    className="mt-0.5 shrink-0 text-[var(--intent-text)] [&_svg]:size-5"
                >
                    {icon}
                </div>
            )}
            <div data-slot="callout-body" className="flex-1 space-y-1">
                {title !== undefined && (
                    <p
                        data-slot="callout-title"
                        className="font-semibold leading-tight text-[var(--intent-text)]"
                    >
                        {title}
                    </p>
                )}
                {children !== undefined && (
                    <div data-slot="callout-content" className="text-sm leading-relaxed text-muted-foreground">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
