// @draft
"use client"

/**
 * @fileoverview AuroraBackground — soft multi-color gradient backdrop for showcase sections.
 * @module packages/ui/components/ui/aurora-background
 * @package ui
 *
 * Three blurred radial blobs (peach + blue + violet by default) sit at the
 * corners of an isolated container, with children rendered above on `z-10`.
 * Drift animation is pure CSS (see `packages/ui/styles/aurora.css`) and obeys
 * `prefers-reduced-motion`.
 *
 * Defaults to a curated showcase palette rather than brand tokens — the visual
 * intent is a consistent atmospheric backdrop regardless of the active palette.
 * Override `colors` to opt into brand-rotating blobs.
 *
 * @component
 * @example
 * import { AuroraBackground } from "@saasflare/ui"
 *
 * <AuroraBackground className="min-h-[500px] rounded-2xl p-12">
 *   <SectionCard title="Production">…</SectionCard>
 * </AuroraBackground>
 *
 * @example
 * // Opt-into brand-rotating colors
 * <AuroraBackground colors={["var(--primary)", "var(--chart-2)", "var(--chart-3)"]}>
 *   <Card>…</Card>
 * </AuroraBackground>
 *
 * @example
 * // Disable drift animation
 * <AuroraBackground animated={false}>
 *   <StaticDemo />
 * </AuroraBackground>
 */

import type { ComponentProps, CSSProperties } from "react"
import { cn } from "../../lib"
import { useSaasflareProps, type SaasflareComponentProps } from "../../providers"

/** Showcase palette used when no `colors` prop is supplied. Peach / blue / violet. */
const DEFAULT_COLORS: readonly [string, string, string] = [
    "hsl(28 90% 75%)",  // peach (top-left)
    "hsl(220 85% 65%)", // blue  (right)
    "hsl(280 70% 75%)", // violet (bottom-left)
] as const

/** Props for the AuroraBackground component. */
export interface AuroraBackgroundProps
    extends Omit<ComponentProps<"div">, keyof SaasflareComponentProps | "color">,
        SaasflareComponentProps {
    /**
     * Three ambient blob colors in order: top-left, right, bottom-left.
     * Default: curated peach + blue + violet showcase palette.
     */
    colors?: readonly [string, string, string]
    /** Overall blob opacity (0–1). Applied inline to every blob. Default: `0.55`. */
    intensity?: number
}

/**
 * Soft multi-color gradient backdrop for showcase, demo, and marketing sections.
 *
 * Renders three blurred radial blobs positioned at corners around the children
 * slot. Default palette is a fixed showcase combination (peach / blue / violet)
 * so the visual stays consistent across brand palettes; pass `colors` to switch
 * to brand-rotating tokens. Drift animation is on by default and respects
 * `prefers-reduced-motion`.
 *
 * @component
 * @layer core
 */
export function AuroraBackground({
    colors = DEFAULT_COLORS,
    intensity = 0.55,
    className,
    children,
    surface,
    radius,
    animated,
    ...props
}: AuroraBackgroundProps) {
    const sf = useSaasflareProps({ surface, radius, animated })

    const blobStyle = (color: string): CSSProperties => ({
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity: intensity,
    })

    return (
        <div
            {...props}
            data-slot="aurora-background"
            data-surface={sf.surface}
            data-radius={sf.radius}
            data-animated={String(sf.animated)}
            className={cn("relative isolate overflow-hidden", className)}
        >
            <div
                aria-hidden="true"
                className="aurora-blob aurora-blob-1 pointer-events-none absolute -top-1/4 -left-1/4 size-[55%] rounded-full blur-3xl dark:opacity-50"
                style={blobStyle(colors[0])}
            />
            <div
                aria-hidden="true"
                className="aurora-blob aurora-blob-2 pointer-events-none absolute top-0 -right-1/4 h-full w-[55%] rounded-full blur-3xl dark:opacity-50"
                style={blobStyle(colors[1])}
            />
            <div
                aria-hidden="true"
                className="aurora-blob aurora-blob-3 pointer-events-none absolute -bottom-1/4 -left-1/4 size-[50%] rounded-full blur-3xl dark:opacity-50"
                style={blobStyle(colors[2])}
            />
            <div className="relative z-10">{children}</div>
        </div>
    )
}
