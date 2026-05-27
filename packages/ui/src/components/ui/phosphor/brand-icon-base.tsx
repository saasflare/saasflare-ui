/**
 * @fileoverview Base primitive for brand-logo Phosphor icons.
 *
 * Brand logos extend the standard four Phosphor weights with a fifth,
 * `"colorful"` — the canonical multi-color brand mark from Iconify's `logos:`
 * set. The colorful path can't reuse {@link IconBase} because brand SVGs
 * have non-square viewBoxes (Apple is 256×315, Discord is 256×199, …) and
 * use hardcoded brand colors instead of `currentColor`.
 *
 * BrandIconBase forks the render at the top:
 *   - weight === "colorful" → emit own `<svg>` with the brand viewBox + content
 *   - otherwise              → delegate to {@link IconBase}
 *
 * @module @saasflare/ui/components/ui/phosphor/brand-icon-base
 */

import * as React from "react"
import {cn} from "../../../lib"
import {IconBase, type IconWeight, type PhosphorIconProps} from "./icon-base"

/** Brand-logo weight set: standard Phosphor weights + the colored brand variant. */
export type BrandIconWeight = IconWeight | "colorful"

/** Public props accepted by every brand-logo icon. Mirrors {@link PhosphorIconProps}, widened to accept `"colorful"`. */
export interface BrandIconProps extends Omit<PhosphorIconProps, "weight"> {
    /** Visual weight. Defaults to "regular". */
    weight?: BrandIconWeight
}

/** The colorful payload — its own viewBox plus the colored SVG content. */
export interface BrandColorful {
    /** Native viewBox of the brand SVG (often non-square — keep it intact for correct proportions). */
    viewBox: string
    /** SVG children (paths, etc.) rendered inside the brand viewBox. */
    content: React.ReactNode
}

/** Internal props — adds the per-icon weights map and colorful payload. */
export interface BrandIconBaseProps extends BrandIconProps {
    weights: Record<IconWeight, React.ReactNode>
    colorful: BrandColorful
}

export const BrandIconBase = React.forwardRef<SVGSVGElement, BrandIconBaseProps>(
    function BrandIconBase(
        {
            weight = "regular",
            size = "1em",
            color = "currentColor",
            weights,
            colorful,
            className,
            children,
            ...rest
        },
        ref,
    ) {
        if (weight === "colorful") {
            return (
                <svg
                    ref={ref}
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox={colorful.viewBox}
                    className={cn("shrink-0", className)}
                    aria-hidden="true"
                    {...rest}
                >
                    {colorful.content}
                    {children}
                </svg>
            )
        }
        return (
            <IconBase
                ref={ref}
                weight={weight}
                weights={weights}
                size={size}
                color={color}
                className={className}
                {...rest}
            >
                {children}
            </IconBase>
        )
    },
)
